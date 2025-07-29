import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

class EnhancedSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
    this.matchSubscriptions = new Map();
  }

  init(server) {
    try {
      this.io = new Server(server, {
        cors: {
          origin: process.env.FRONTEND_URL || "http://localhost:8080",
          methods: ["GET", "POST"],
          credentials: true
        },
        transports: ['websocket', 'polling']
      });

      // Authentication middleware
      this.io.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth.token;
          
          if (!token) {
            return next(new Error('Authentication token required'));
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          // Get user data
          const { data: user, error } = await supabase
            .from('users')
            .select('id, email, name, sport')
            .eq('id', decoded.userId)
            .single();

          if (error || !user) {
            return next(new Error('Invalid token or user not found'));
          }

          socket.userId = user.id;
          socket.userEmail = user.email;
          socket.userName = user.name;
          socket.userSport = user.sport;
          
          next();
        } catch (error) {
          console.error('❌ Socket authentication error:', error);
          next(new Error('Authentication failed'));
        }
      });

      this.setupEventHandlers();
      
      console.log('✅ Socket.IO service initialized');
      return this.io;
      
    } catch (error) {
      console.error('❌ Socket.IO initialization failed:', error);
      throw error;
    }
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`✅ User connected: ${socket.userName} (${socket.id})`);
      
      // Store user connection
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        email: socket.userEmail,
        name: socket.userName,
        sport: socket.userSport,
        connectedAt: new Date().toISOString()
      });

      // Join user to their personal room
      socket.join(`user:${socket.userId}`);

      // Handle match subscription
      socket.on('subscribe-match', async (matchId) => {
        try {
          // Verify user has access to this match
          const hasAccess = await this.verifyMatchAccess(socket.userId, matchId);
          
          if (!hasAccess) {
            socket.emit('error', { message: 'Access denied to this match' });
            return;
          }

          socket.join(`match:${matchId}`);
          
          // Track subscription
          if (!this.matchSubscriptions.has(matchId)) {
            this.matchSubscriptions.set(matchId, new Set());
          }
          this.matchSubscriptions.get(matchId).add(socket.userId);

          console.log(`✅ User ${socket.userName} subscribed to match ${matchId}`);
          
          // Send current match state
          const matchData = await this.getMatchData(matchId);
          socket.emit('match-state', matchData);
          
        } catch (error) {
          console.error('❌ Match subscription error:', error);
          socket.emit('error', { message: 'Failed to subscribe to match' });
        }
      });

      // Handle match unsubscription
      socket.on('unsubscribe-match', (matchId) => {
        try {
          socket.leave(`match:${matchId}`);
          
          if (this.matchSubscriptions.has(matchId)) {
            this.matchSubscriptions.get(matchId).delete(socket.userId);
          }

          console.log(`✅ User ${socket.userName} unsubscribed from match ${matchId}`);
        } catch (error) {
          console.error('❌ Match unsubscription error:', error);
        }
      });

      // Handle real-time match updates
      socket.on('match-update', async (data) => {
        try {
          const { matchId, updateType, updateData } = data;
          
          // Verify user can update this match
          const canUpdate = await this.verifyMatchUpdatePermission(socket.userId, matchId);
          
          if (!canUpdate) {
            socket.emit('error', { message: 'Permission denied to update this match' });
            return;
          }

          // Process the update
          await this.processMatchUpdate(matchId, updateType, updateData, socket.userId);
          
          // Broadcast to all subscribers
          this.io.to(`match:${matchId}`).emit('match-updated', {
            matchId,
            updateType,
            updateData,
            updatedBy: socket.userName,
            timestamp: new Date().toISOString()
          });

          console.log(`✅ Match update broadcasted: ${updateType} for match ${matchId}`);
          
        } catch (error) {
          console.error('❌ Match update error:', error);
          socket.emit('error', { message: 'Failed to update match' });
        }
      });

      // Handle chat messages
      socket.on('chat-message', async (data) => {
        try {
          const { matchId, message } = data;
          
          // Verify user has access
          const hasAccess = await this.verifyMatchAccess(socket.userId, matchId);
          
          if (!hasAccess) {
            socket.emit('error', { message: 'Access denied' });
            return;
          }

          // Save message to database
          const { data: savedMessage, error } = await supabase
            .from('thread_messages')
            .insert({
              thread_id: matchId,
              user_id: socket.userId,
              content: message,
              message_type: 'text',
              timestamp: new Date().toISOString()
            })
            .select()
            .single();

          if (error) throw error;

          // Broadcast to match subscribers
          this.io.to(`match:${matchId}`).emit('new-message', {
            id: savedMessage.id,
            content: message,
            userName: socket.userName,
            userId: socket.userId,
            timestamp: savedMessage.timestamp
          });

          console.log(`✅ Chat message sent in match ${matchId} by ${socket.userName}`);
          
        } catch (error) {
          console.error('❌ Chat message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing-start', (data) => {
        const { matchId } = data;
        socket.to(`match:${matchId}`).emit('user-typing', {
          userId: socket.userId,
          userName: socket.userName
        });
      });

      socket.on('typing-stop', (data) => {
        const { matchId } = data;
        socket.to(`match:${matchId}`).emit('user-stopped-typing', {
          userId: socket.userId
        });
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`❌ User disconnected: ${socket.userName} (${reason})`);
        
        // Clean up user data
        this.connectedUsers.delete(socket.userId);
        
        // Clean up match subscriptions
        this.matchSubscriptions.forEach((subscribers, matchId) => {
          subscribers.delete(socket.userId);
          if (subscribers.size === 0) {
            this.matchSubscriptions.delete(matchId);
          }
        });
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`❌ Socket error for user ${socket.userName}:`, error);
      });
    });
  }

  // Broadcast match update to all subscribers
  async broadcastMatchUpdate(matchId, updateData) {
    try {
      this.io.to(`match:${matchId}`).emit('match-updated', {
        matchId,
        ...updateData,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Match update broadcasted to match ${matchId}`);
    } catch (error) {
      console.error('❌ Broadcast error:', error);
    }
  }

  // Send notification to specific user
  async notifyUser(userId, notification) {
    try {
      this.io.to(`user:${userId}`).emit('notification', {
        ...notification,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Notification sent to user ${userId}`);
    } catch (error) {
      console.error('❌ User notification error:', error);
    }
  }

  // Verify user has access to match
  async verifyMatchAccess(userId, matchId) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          home_team_id,
          away_team_id,
          teams!matches_home_team_id_fkey(coach_id),
          teams!matches_away_team_id_fkey(coach_id)
        `)
        .eq('id', matchId)
        .single();

      if (error) return false;

      // Check if user is coach of either team
      const homeCoachId = data.teams?.coach_id;
      const awayCoachId = data.teams?.coach_id;
      
      return userId === homeCoachId || userId === awayCoachId;
      
    } catch (error) {
      console.error('❌ Match access verification error:', error);
      return false;
    }
  }

  // Verify user can update match
  async verifyMatchUpdatePermission(userId, matchId) {
    // For now, same as access verification
    // Could be extended with more granular permissions
    return await this.verifyMatchAccess(userId, matchId);
  }

  // Process match update
  async processMatchUpdate(matchId, updateType, updateData, userId) {
    try {
      let updateQuery = {};
      
      switch (updateType) {
        case 'score':
          updateQuery.score = updateData;
          break;
        case 'event':
          // Add event to events array
          const { data: currentMatch } = await supabase
            .from('matches')
            .select('events')
            .eq('id', matchId)
            .single();
          
          const events = currentMatch?.events || [];
          events.push({
            ...updateData,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            addedBy: userId
          });
          
          updateQuery.events = events;
          break;
        case 'status':
          updateQuery.status = updateData.status;
          break;
        default:
          throw new Error(`Unknown update type: ${updateType}`);
      }

      // Update match in database
      const { error } = await supabase
        .from('matches')
        .update({
          ...updateQuery,
          updated_at: new Date().toISOString()
        })
        .eq('id', matchId);

      if (error) throw error;
      
      console.log(`✅ Match ${matchId} updated: ${updateType}`);
      
    } catch (error) {
      console.error('❌ Process match update error:', error);
      throw error;
    }
  }

  // Get current match data
  async getMatchData(matchId) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name)
        `)
        .eq('id', matchId)
        .single();

      if (error) throw error;
      
      return data;
      
    } catch (error) {
      console.error('❌ Get match data error:', error);
      return null;
    }
  }

  // Get connection statistics
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      activeMatches: this.matchSubscriptions.size,
      totalSubscriptions: Array.from(this.matchSubscriptions.values())
        .reduce((total, subscribers) => total + subscribers.size, 0)
    };
  }
}

export default new EnhancedSocketService();