import React, { useState, useEffect, useRef } from 'react';
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
  Target,
  Zap,
  Brain,
  Lightbulb,
  Shield,
  Play,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  RefreshCw,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSport } from '@/contexts/SportContext';
import { chatbotAPI } from '@/lib/api';
import { toast } from 'sonner';

interface TacticalMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: 'formation' | 'strategy' | 'analysis' | 'suggestion' | 'general';
  actions?: TacticalAction[];
  rating?: number;
}

interface TacticalAction {
  id: string;
  label: string;
  type: 'button' | 'link' | 'formation';
  action: () => void;
  icon?: React.ReactNode;
}

export const TacticalAIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<TacticalMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { sport } = useSport();

  // Initialize with tactical welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: TacticalMessage = {
        id: 'tactical_welcome',
        type: 'bot',
        content: `🧠 **Tactical AI Assistant Ready!**

Hello ${user.name || 'Coach'}! I'm your intelligent tactical advisor specialized in ${sport === 'soccer' ? 'football' : 'futsal'} strategy and analysis.

**What I can help you with:**

🎯 **Formation Analysis** - "Analyze 4-3-3 formation"
⚡ **Tactical Adjustments** - "How to counter high press?"
📊 **Performance Insights** - "Analyze team's defensive weaknesses"
🔄 **In-Game Decisions** - "Should I make a substitution?"
🎨 **Training Suggestions** - "Drills to improve possession"
📈 **Match Preparation** - "How to prepare for strong opponents"

**${sport === 'soccer' ? 'Football' : 'Futsal'}-Specific Expertise:**
${sport === 'soccer' 
  ? '• 11v11 formations and tactics\n• Set piece strategies\n• Large field positioning\n• 90-minute game management'
  : '• 5v5 formations and rotations\n• Small space tactics\n• High-intensity strategies\n• Quick transition plays'
}

Ask me anything about tactics, formations, or strategic decisions!`,
        timestamp: new Date(),
        category: 'general',
        actions: [
          {
            id: 'formation_analysis',
            label: 'Formation Analysis',
            type: 'button',
            action: () => setInputValue('Analyze our current formation'),
            icon: <Users className="w-4 h-4" />
          },
          {
            id: 'tactical_advice',
            label: 'Tactical Advice',
            type: 'button',
            action: () => setInputValue('Give me tactical advice for next match'),
            icon: <Brain className="w-4 h-4" />
          },
          {
            id: 'training_drill',
            label: 'Training Drills',
            type: 'button',
            action: () => setInputValue('Suggest training drills for possession'),
            icon: <Target className="w-4 h-4" />
          }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length, sport]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playNotificationSound = () => {
    if (soundEnabled) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    }
  };

  const processTacticalMessage = async (message: string) => {
    setIsTyping(true);
    
    try {
      const response = await chatbotAPI.sendMessage(message, {
        type: 'tactical',
        sport: sport,
        userId: user?.id,
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        const botResponse: TacticalMessage = {
          id: `bot_${Date.now()}`,
          type: 'bot',
          content: response.data.data.response,
          timestamp: new Date(),
          category: 'general'
        };

        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      const errorResponse: TacticalMessage = {
        id: `error_${Date.now()}`,
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your tactical request. Please try again or ask me about formations, strategies, or training methods.',
        timestamp: new Date(),
        category: 'general'
      };
      setMessages(prev => [...prev, errorResponse]);
    }

    setIsTyping(false);
    playNotificationSound();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: TacticalMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      category: 'general'
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputValue;
    setInputValue('');

    await processTacticalMessage(messageToProcess);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const rateMessage = (messageId: string, rating: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
    toast.success('Thank you for your feedback!');
  };

  // Helper functions
  const extractFormation = (message: string): string | null => {
    const formations = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '4-5-1'];
    return formations.find(formation => message.includes(formation)) || null;
  };

  const extractTrainingFocus = (message: string): string => {
    if (message.toLowerCase().includes('possession')) return 'Possession Play';
    if (message.toLowerCase().includes('defense')) return 'Defensive Organization';
    if (message.toLowerCase().includes('attack')) return 'Attacking Patterns';
    if (message.toLowerCase().includes('fitness')) return 'Physical Conditioning';
    return 'General Skills';
  };

  const getFormationAnalysis = (formation: string, sport: string | null): string => {
    const analyses: Record<string, string> = {
      '4-3-3': sport === 'soccer' 
        ? 'Balanced formation with strong wing presence and midfield control'
        : 'Adapted for futsal with emphasis on wide play and quick rotations',
      '4-4-2': sport === 'soccer'
        ? 'Classic formation with strong midfield presence and dual striker threat'
        : 'Compact formation ideal for defensive stability and quick counters',
      '4-2-3-1': sport === 'soccer'
        ? 'Modern formation with creative freedom and defensive stability'
        : 'Flexible setup allowing for creative play and solid defensive base'
    };
    return analyses[formation] || 'Versatile formation with balanced approach';
  };

  const getFormationPrinciples = (formation: string): string => {
    const principles: Record<string, string> = {
      '4-3-3': '• Width in attack\n• Midfield triangle\n• High pressing\n• Quick transitions',
      '4-4-2': '• Compact midfield\n• Dual striker partnership\n• Defensive solidity\n• Direct play',
      '4-2-3-1': '• Creative freedom\n• Defensive balance\n• Flexible attacking\n• Controlled build-up'
    };
    return principles[formation] || '• Balanced approach\n• Tactical flexibility\n• Team coordination';
  };

  const getPlayerRoles = (formation: string): string => {
    const roles: Record<string, string> = {
      '4-3-3': '🥅 GK: Sweeper-keeper\n🛡️ FB: Attacking fullbacks\n🛡️ CB: Ball-playing defenders\n⚡ CM: Box-to-box\n🎨 W: Inside forwards\n⚽ ST: False 9 or target man',
      '4-4-2': '🥅 GK: Traditional keeper\n🛡️ FB: Balanced fullbacks\n🛡️ CB: Strong defenders\n⚡ CM: Central midfielders\n⚽ ST: Strike partnership',
      '4-2-3-1': '🥅 GK: Distribution focus\n🛡️ FB: Attacking fullbacks\n🛡️ CB: Ball-playing defenders\n⚡ DM: Defensive midfielders\n🎨 AM: Creative players\n⚽ ST: Complete striker'
    };
    return roles[formation] || 'Balanced player roles across all positions';
  };

  const getFormationStrengths = (formation: string): string => {
    const strengths: Record<string, string> = {
      '4-3-3': 'Width, pressing, midfield control',
      '4-4-2': 'Simplicity, defensive stability, direct attacks',
      '4-2-3-1': 'Creativity, balance, tactical flexibility'
    };
    return strengths[formation] || 'Tactical balance and flexibility';
  };

  const getFormationWeaknesses = (formation: string): string => {
    const weaknesses: Record<string, string> = {
      '4-3-3': 'Vulnerable to counters, requires high work rate',
      '4-4-2': 'Midfield can be outnumbered, limited creativity',
      '4-2-3-1': 'Complex coordination, requires technical players'
    };
    return weaknesses[formation] || 'Requires good tactical understanding';
  };

  const getFormationCounters = (formation: string): string => {
    const counters: Record<string, string> = {
      '4-3-3': 'Effective against 4-4-2 and defensive setups',
      '4-4-2': 'Good against possession-based teams',
      '4-2-3-1': 'Versatile against most formations'
    };
    return counters[formation] || 'Adaptable to various opponent styles';
  };

  const renderMessage = (message: TacticalMessage) => {
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
            isUser ? 'bg-primary text-white ml-2' : 'bg-blue-100 text-blue-600 mr-2'
          }`}>
            {isUser ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
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
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-24 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <Brain className="w-6 h-6" />
              {messages.length > 1 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
          )}
        </Button>
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-40 bg-white rounded-lg shadow-2xl border border-gray-200 ${
              isMinimized 
                ? 'bottom-24 right-6 w-80 h-16' 
                : 'bottom-6 right-6 w-[420px] h-[600px]'
            }`}
            style={{
              maxHeight: 'calc(100vh - 100px)',
              maxWidth: 'calc(100vw - 24px)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span className="font-semibold">Tactical AI</span>
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
                {/* Messages */}
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
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Brain className="w-4 h-4 text-blue-600" />
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

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about tactics, formations, or strategy..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      size="sm"
                      className="px-3 bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputValue('Analyze our formation')}
                      className="text-xs h-6"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Formation
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputValue('Tactical advice needed')}
                      className="text-xs h-6"
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      Strategy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputValue('Training drill suggestions')}
                      className="text-xs h-6"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      Training
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