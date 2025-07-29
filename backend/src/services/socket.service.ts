import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { DatabaseService } from './database.service';
import { logger } from '../utils/logger';

export class SocketService {
  private io: Server;
  private databaseService: DatabaseService;
  private connectedUsers: Map<string, string> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.databaseService = new DatabaseService();
    this.initializeSocketHandlers();
  }

  private initializeSocketHandlers(): void {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, config.jwt.secret) as any;
        const user = await this.databaseService.getUserById(decoded.userId);
        
        if (!user) {
          return next(new Error('Authentication error'));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      const user = socket.data.user;
      this.connectedUsers.set(socket.id, user.id);
      
      logger.info(`User connected: ${user.email}`);

      // Join user to their personal room
      socket.join(`user:${user.id}`);

      // Handle match events
      socket.on('join_match', (matchId) => {
        socket.join(`match:${matchId}`);
        logger.info(`User ${user.id} joined match ${matchId}`);
      });

      socket.on('leave_match', (matchId) => {
        socket.leave(`match:${matchId}`);
        logger.info(`User ${user.id} left match ${matchId}`);
      });

      // Handle real-time match updates
      socket.on('match_event', (data) => {
        this.broadcastMatchEvent(data.matchId, data.event);
      });

      // Handle chatbot messages
      socket.on('chatbot_message', async (data) => {
        try {
          const response = await this.processChatbotMessage(user.id, data.message);
          socket.emit('chatbot_response', { response });
        } catch (error) {
          logger.error('Chatbot message error:', error);
          socket.emit('chatbot_error', { message: 'Failed to process message' });
        }
      });

      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.id);
        logger.info(`User disconnected: ${user.email}`);
      });
    });
  }

  public broadcastMatchEvent(matchId: string, event: any): void {
    this.io.to(`match:${matchId}`).emit('match_event', event);
  }

  public notifyUser(userId: string, notification: any): void {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  private async processChatbotMessage(userId: string, message: string): Promise<string> {
    // This would integrate with the ChatbotService
    return "This is a placeholder response";
  }
}