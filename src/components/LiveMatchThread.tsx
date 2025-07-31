import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Users, Clock, MapPin, Heart, ThumbsUp, Flag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import io from 'socket.io-client';

interface MatchThread {
  id: string;
  match_id: string;
  title: string;
  description: string;
  participant_count: number;
  is_active: boolean;
  created_at: string;
}

interface ThreadMessage {
  id: string;
  thread_id: string;
  user_id: string;
  username: string;
  content: string;
  message_type: 'text' | 'photo' | 'video' | 'heatmap';
  reactions: {
    heart: number;
    thumbs_up: number;
    fire: number;
  };
  timestamp: string;
}

interface LiveMatchThreadProps {
  matchId?: string;
}

export const LiveMatchThread: React.FC<LiveMatchThreadProps> = ({ matchId }) => {
  const { user } = useAuth();
  const [activeThreads, setActiveThreads] = useState<MatchThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MatchThread | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    try {
      socketRef.current = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', {
        auth: {
          token: localStorage.getItem('auth_token')
        },
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        console.log('✅ Connected to match thread socket');
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        console.log('❌ Disconnected from match thread socket');
      });

      socketRef.current.on('new-message', (message: ThreadMessage) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

      socketRef.current.on('user-typing', (data: { userId: string; userName: string }) => {
        if (data.userId !== user.id) {
          setTypingUsers(prev => [...prev.filter(u => u !== data.userName), data.userName]);
        }
      });

      socketRef.current.on('user-stopped-typing', (data: { userId: string }) => {
        if (data.userId !== user.id) {
          setTypingUsers(prev => prev.filter(u => u !== data.userId));
        }
      });

      socketRef.current.on('error', (error: any) => {
        console.error('Socket error:', error);
        toast.error('Connection error. Please refresh the page.');
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  }, [user]);

  // Load active threads
  useEffect(() => {
    loadActiveThreads();
  }, []);

  // Subscribe to selected thread
  useEffect(() => {
    if (selectedThread && socketRef.current && isConnected) {
      socketRef.current.emit('subscribe-match', selectedThread.match_id);
      loadMessages(selectedThread.id);
    }

    return () => {
      if (selectedThread && socketRef.current) {
        socketRef.current.emit('unsubscribe-match', selectedThread.match_id);
      }
    };
  }, [selectedThread, isConnected]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadActiveThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('match_threads')
        .select(`
          *,
          matches (
            home_team_id,
            away_team_id,
            date,
            venue,
            status
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setActiveThreads(data || []);
    } catch (error) {
      console.error('Error loading threads:', error);
      toast.error('Failed to load match threads');
    }
  };

  const loadMessages = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('thread_messages')
        .select(`
          *,
          users (
            name
          )
        `)
        .eq('thread_id', threadId)
        .order('timestamp', { ascending: true })
        .limit(100);

      if (error) throw error;

      const formattedMessages = data?.map(msg => ({
        id: msg.id,
        thread_id: msg.thread_id,
        user_id: msg.user_id,
        username: msg.users?.name || 'Anonymous',
        content: msg.content,
        message_type: msg.message_type,
        reactions: msg.reactions || { heart: 0, thumbs_up: 0, fire: 0 },
        timestamp: msg.timestamp
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !user || !socketRef.current) return;

    try {
      socketRef.current.emit('chat-message', {
        matchId: selectedThread.match_id,
        message: newMessage.trim()
      });

      setNewMessage('');
      stopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (socketRef.current && selectedThread) {
      socketRef.current.emit('typing-start', { matchId: selectedThread.match_id });
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    }
  };

  const stopTyping = () => {
    if (socketRef.current && selectedThread) {
      socketRef.current.emit('typing-stop', { matchId: selectedThread.match_id });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const addReaction = async (messageId: string, reactionType: 'heart' | 'thumbs_up' | 'fire') => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const updatedReactions = {
        ...message.reactions,
        [reactionType]: message.reactions[reactionType] + 1
      };

      const { error } = await supabase
        .from('thread_messages')
        .update({ reactions: updatedReactions })
        .eq('id', messageId);

      if (error) throw error;

      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, reactions: updatedReactions } : m
      ));

    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  const renderMessage = (message: ThreadMessage) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex space-x-3 p-3 hover:bg-gray-50 rounded-lg"
    >
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {message.username.charAt(0).toUpperCase()}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-sm">{message.username}</span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="text-sm text-gray-900 mb-2">{message.content}</div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => addReaction(message.id, 'heart')}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500"
          >
            <Heart className="w-3 h-3" />
            <span>{message.reactions.heart}</span>
          </button>
          
          <button
            onClick={() => addReaction(message.id, 'thumbs_up')}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500"
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{message.reactions.thumbs_up}</span>
          </button>
          
          <button
            onClick={() => addReaction(message.id, 'fire')}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-orange-500"
          >
            <span>🔥</span>
            <span>{message.reactions.fire}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (!user) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Sign In Required</h3>
        <p className="text-gray-500">Please sign in to join match discussions</p>
      </div>
    );
  }

  if (!selectedThread) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Live Match Threads</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        {activeThreads.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Threads</h3>
            <p className="text-gray-500">No live match discussions at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeThreads.map(thread => (
              <Card
                key={thread.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedThread(thread)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{thread.title}</h3>
                    <Badge className="bg-red-500 text-white">
                      LIVE
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{thread.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{thread.participant_count} participants</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(thread.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{selectedThread.title}</h2>
            <p className="text-sm text-gray-600">{selectedThread.description}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{selectedThread.participant_count}</span>
            </div>
            
            <Button
              onClick={() => setSelectedThread(null)}
              variant="outline"
              size="sm"
            >
              Back to Threads
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {messages.map(renderMessage)}
        </AnimatePresence>
        
        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 italic">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4 bg-white">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share your thoughts on the match..."
            className="flex-1"
            disabled={!isConnected}
          />
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">
            Disconnected - trying to reconnect...
          </p>
        )}
      </div>
    </div>
  );
};

export default LiveMatchThread;