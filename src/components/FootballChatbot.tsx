import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Target,
  HelpCircle,
  Download,
  Upload,
  Settings,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  RefreshCw,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { chatbotAPI } from '@/lib/api';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
  messageType?: 'text' | 'analysis' | 'stats' | 'chart' | 'tutorial' | 'suggestion';
  actions?: ChatAction[];
  rating?: number;
}

interface ChatAction {
  id: string;
  label: string;
  type: 'button' | 'link' | 'download';
  action: () => void;
  icon?: React.ReactNode;
}

export const FootballChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { t } = useLanguage();

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: `Hello ${user.name || 'Coach'}! 👋

I'm your intelligent football analysis assistant. I can help you with:

⚽ **Match Analysis** - "Analyze Real Madrid vs Barcelona"
📊 **Player Statistics** - "Show me Messi's current stats"  
🎯 **Tactical Insights** - "Tactical breakdown of 4-3-3 formation"
📈 **Performance Trends** - "Team performance this season"
🔮 **Predictions** - "Predict Manchester City vs Liverpool"
💡 **Suggestions** - Share ideas to improve the platform

Just type naturally - I understand football language! What would you like to explore?`,
        timestamp: new Date(),
        messageType: 'text',
        actions: [
          {
            id: 'analyze_match',
            label: 'Analyze Match',
            type: 'button',
            action: () => setInputValue('Analyze the latest El Clasico match'),
            icon: <BarChart3 className="w-4 h-4" />
          },
          {
            id: 'player_stats',
            label: 'Player Stats',
            type: 'button',
            action: () => setInputValue('Show me Lionel Messi statistics'),
            icon: <Users className="w-4 h-4" />
          },
          {
            id: 'suggestions',
            label: 'Make Suggestion',
            type: 'button',
            action: () => setInputValue('I suggest adding '),
            icon: <Star className="w-4 h-4" />
          }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Play notification sound
  const playNotificationSound = () => {
    if (soundEnabled) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {}); // Ignore errors if audio fails
    }
  };

  const sendSuggestionEmail = async (suggestion: string, userInfo: any) => {
    try {
      const response = await chatbotAPI.sendMessage(suggestion, { type: 'suggestion' });
      return { success: response.data.success };
    } catch (error) {
      console.error('Failed to send suggestion email:', error);
      return { success: false, error };
    }
  };

  const generateMockAnalysis = (query: string) => {
    return {
      matchId: 'MATCH_001',
      teams: { home: 'Real Madrid', away: 'FC Barcelona' },
      score: { home: 2, away: 1 },
      date: '2024-01-15',
      league: 'La Liga',
      statistics: {
        possession: { home: 58, away: 42 },
        shots: { home: 15, away: 12 },
        shotsOnTarget: { home: 8, away: 5 },
        corners: { home: 7, away: 4 },
        fouls: { home: 12, away: 16 },
        cards: { home: { yellow: 3, red: 0 }, away: { yellow: 5, red: 1 } }
      },
      keyMoments: [
        { minute: 23, type: 'goal', description: 'Benzema opens scoring', impact: 'high' },
        { minute: 67, type: 'goal', description: 'Lewandowski equalizes', impact: 'high' },
        { minute: 89, type: 'goal', description: 'Benzema scores winner', impact: 'high' }
      ],
      insights: [
        'Real Madrid controlled the midfield effectively',
        'Barcelona created more chances but lacked clinical finishing',
        'The match was decided by individual brilliance from Benzema'
      ]
    };
  };

  const processMessage = async (message: string) => {
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await chatbotAPI.sendMessage(message, {
        sport: sport || 'soccer',
        userId: user?.id,
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        const botResponse: ChatMessage = {
          id: `bot_${Date.now()}`,
          type: 'bot',
          content: response.data.data.response,
          timestamp: new Date(),
          messageType: 'text'
        };

        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      const errorResponse: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your request. Please try again or ask me something else about football analysis.',
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => [...prev, errorResponse]);
    }

    setIsTyping(false);
    setIsLoading(false);
    playNotificationSound();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputValue;
    setInputValue('');

    await processMessage(messageToProcess);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const extractTeamNames = (content: string): { home?: string; away?: string } => {
    const vsPattern = /(\w+(?:\s+\w+)*)\s+(?:vs|v|against)\s+(\w+(?:\s+\w+)*)/i;
    const match = content.match(vsPattern);
    
    if (match) {
      return { home: match[1].trim(), away: match[2].trim() };
    }

    const teams = ['Real Madrid', 'Barcelona', 'Manchester City', 'Liverpool', 'PSG', 'Bayern Munich'];
    const foundTeam = teams.find(team => content.toLowerCase().includes(team.toLowerCase()));
    
    return foundTeam ? { home: foundTeam } : {};
  };

  const extractPlayerName = (content: string): string | null => {
    const players = ['Messi', 'Ronaldo', 'Mbappé', 'Haaland', 'Neymar', 'Benzema'];
    return players.find(player => content.toLowerCase().includes(player.toLowerCase())) || null;
  };

  const rateMessage = (messageId: string, rating: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
    toast.success('Thank you for your feedback!');
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary text-white ml-2' : 'bg-gray-200 text-gray-600 mr-2'
          }`}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-primary text-white' 
              : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="text-sm whitespace-pre-line">{message.content}</div>
            
            {/* Action buttons */}
            {message.actions && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.actions.map(action => (
                  <Button
                    key={action.id}
                    size="sm"
                    variant="outline"
                    onClick={action.action}
                    className="text-xs h-7"
                  >
                    {action.icon}
                    <span className="ml-1">{action.label}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Message rating */}
            {!isUser && !message.rating && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Helpful?</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => rateMessage(message.id, 1)}
                  className="h-6 w-6 p-0"
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => rateMessage(message.id, -1)}
                  className="h-6 w-6 p-0"
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Chat Toggle Button - Updated with new football image */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-xl border-4 border-white overflow-hidden p-0"
          size="sm"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/360_F_683941481_OLhYrjnwaGk4clbTW2DyxUYT2Tcr1ecA.jpg" 
                alt="Football" 
                className="w-12 h-12 object-cover rounded-full"
                style={{
                  filter: 'brightness(1.1) contrast(1.2)',
                  objectPosition: 'center'
                }}
              />
              {messages.length > 1 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{messages.length - 1}</span>
                </div>
              )}
            </div>
          )}
        </Button>
      </motion.div>

      {/* Chat Interface - Perfectly fitted to screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-40 bg-white rounded-lg shadow-2xl border border-gray-200 ${
              isMinimized 
                ? 'bottom-24 right-6 w-80 h-16' 
                : 'bottom-6 right-6 w-[420px] h-[600px] md:bottom-24 md:right-6 md:w-96 md:h-[600px]'
            }`}
            style={{
              maxHeight: 'calc(100vh - 100px)',
              maxWidth: 'calc(100vw - 24px)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Football AI Assistant</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages - Perfectly scrollable */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ height: 'calc(100% - 140px)' }}>
                  {messages.map(renderMessage)}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input - Always accessible */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about football analysis, stats, or make suggestions..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      size="sm"
                      className="px-3 bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Actions - Always visible */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputValue('Analyze latest match')}
                      className="text-xs h-6"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analyze
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputValue('Show player stats')}
                      className="text-xs h-6"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Stats
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputValue('I suggest ')}
                      className="text-xs h-6"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Suggest
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};