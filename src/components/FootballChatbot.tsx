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
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
  messageType?: 'text' | 'analysis' | 'stats' | 'chart' | 'tutorial';
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

interface AnalysisData {
  matchId: string;
  teams: { home: string; away: string };
  score: { home: number; away: number };
  date: string;
  league: string;
  statistics: {
    possession: { home: number; away: number };
    shots: { home: number; away: number };
    shotsOnTarget: { home: number; away: number };
    corners: { home: number; away: number };
    fouls: { home: number; away: number };
    cards: { home: { yellow: number; red: number }; away: { yellow: number; red: number } };
  };
  playerStats: PlayerStat[];
  tacticalAnalysis: TacticalAnalysis;
  predictions: Prediction[];
}

interface PlayerStat {
  name: string;
  team: string;
  position: string;
  rating: number;
  goals: number;
  assists: number;
  passes: number;
  passAccuracy: number;
  tackles: number;
  interceptions: number;
  minutesPlayed: number;
}

interface TacticalAnalysis {
  formation: { home: string; away: string };
  keyMoments: KeyMoment[];
  strengths: { home: string[]; away: string[] };
  weaknesses: { home: string[]; away: string[] };
  recommendations: string[];
}

interface KeyMoment {
  minute: number;
  type: 'goal' | 'card' | 'substitution' | 'tactical_change';
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface Prediction {
  type: 'next_match' | 'season_performance' | 'player_development';
  confidence: number;
  description: string;
  factors: string[];
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  action?: string;
  completed: boolean;
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
  const [userPreferences, setUserPreferences] = useState({
    favoriteTeams: [] as string[],
    preferredLeagues: [] as string[],
    analysisDepth: 'detailed' as 'basic' | 'detailed' | 'expert',
    notifications: true
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { t } = useLanguage();

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Football Analysis AI',
      description: 'I can help you analyze matches, compare players, and provide tactical insights.',
      completed: false
    },
    {
      id: 'basic_commands',
      title: 'Basic Commands',
      description: 'Try asking: "Analyze Real Madrid vs Barcelona" or "Show me Messi\'s stats"',
      completed: false
    },
    {
      id: 'advanced_features',
      title: 'Advanced Features',
      description: 'I can create custom reports, predict match outcomes, and track player development.',
      completed: false
    },
    {
      id: 'data_export',
      title: 'Data Export',
      description: 'Export any analysis as PDF, Excel, or share directly to your team.',
      completed: false
    }
  ];

  // Initialize chatbot
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: `Hello ${user.name}! I'm your Football Analysis AI assistant. I can help you with match analysis, player statistics, tactical breakdowns, and much more. What would you like to explore today?`,
        timestamp: new Date(),
        messageType: 'text',
        actions: [
          {
            id: 'analyze_match',
            label: 'Analyze a Match',
            type: 'button',
            action: () => handleQuickAction('analyze_match'),
            icon: <BarChart3 className="w-4 h-4" />
          },
          {
            id: 'player_stats',
            label: 'Player Statistics',
            type: 'button',
            action: () => handleQuickAction('player_stats'),
            icon: <Users className="w-4 h-4" />
          },
          {
            id: 'tutorial',
            label: 'Take Tutorial',
            type: 'button',
            action: () => startTutorial(),
            icon: <HelpCircle className="w-4 h-4" />
          }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

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

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'analyze_match':
        setInputValue('Analyze the latest El Clasico match');
        break;
      case 'player_stats':
        setInputValue('Show me Lionel Messi\'s current season statistics');
        break;
      case 'tactical_analysis':
        setInputValue('Provide tactical analysis for Manchester City vs Liverpool');
        break;
    }
  };

  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
    const tutorialMessage: ChatMessage = {
      id: `tutorial_${Date.now()}`,
      type: 'bot',
      content: 'Great! Let me show you around. I\'ll guide you through my key features.',
      timestamp: new Date(),
      messageType: 'tutorial'
    };
    setMessages(prev => [...prev, tutorialMessage]);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      const completionMessage: ChatMessage = {
        id: `tutorial_complete_${Date.now()}`,
        type: 'bot',
        content: 'Tutorial completed! You\'re now ready to explore all my features. Feel free to ask me anything about football analysis.',
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => [...prev, completionMessage]);
    }
  };

  const generateMockAnalysis = (query: string): AnalysisData => {
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
      playerStats: [
        {
          name: 'Karim Benzema',
          team: 'Real Madrid',
          position: 'Forward',
          rating: 8.5,
          goals: 2,
          assists: 0,
          passes: 45,
          passAccuracy: 87,
          tackles: 1,
          interceptions: 0,
          minutesPlayed: 90
        },
        {
          name: 'Robert Lewandowski',
          team: 'FC Barcelona',
          position: 'Forward',
          rating: 7.2,
          goals: 1,
          assists: 0,
          passes: 38,
          passAccuracy: 82,
          tackles: 0,
          interceptions: 1,
          minutesPlayed: 90
        }
      ],
      tacticalAnalysis: {
        formation: { home: '4-3-3', away: '4-2-3-1' },
        keyMoments: [
          {
            minute: 23,
            type: 'goal',
            description: 'Benzema opens scoring with clinical finish',
            impact: 'high'
          },
          {
            minute: 67,
            type: 'goal',
            description: 'Lewandowski equalizes from penalty spot',
            impact: 'high'
          },
          {
            minute: 89,
            type: 'goal',
            description: 'Benzema scores winner in dying minutes',
            impact: 'high'
          }
        ],
        strengths: {
          home: ['Clinical finishing', 'Midfield control', 'Defensive solidity'],
          away: ['Creative attacking play', 'High pressing', 'Ball retention']
        },
        weaknesses: {
          home: ['Slow build-up play', 'Limited width'],
          away: ['Defensive vulnerabilities', 'Poor finishing']
        },
        recommendations: [
          'Barcelona should focus on defensive stability',
          'Real Madrid could exploit wide areas more effectively',
          'Both teams need better finishing in final third'
        ]
      },
      predictions: [
        {
          type: 'next_match',
          confidence: 78,
          description: 'Real Madrid likely to win next encounter based on current form',
          factors: ['Home advantage', 'Better defensive record', 'Key player availability']
        }
      ]
    };
  };

  const processMessage = async (message: string) => {
    setIsLoading(true);
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response: ChatMessage;

    // Simple keyword-based responses (in production, this would be an AI service)
    if (message.toLowerCase().includes('analyze') || message.toLowerCase().includes('match')) {
      const analysisData = generateMockAnalysis(message);
      response = {
        id: `analysis_${Date.now()}`,
        type: 'bot',
        content: `Here's the detailed analysis for ${analysisData.teams.home} vs ${analysisData.teams.away}:`,
        timestamp: new Date(),
        messageType: 'analysis',
        data: analysisData,
        actions: [
          {
            id: 'export_pdf',
            label: 'Export as PDF',
            type: 'download',
            action: () => exportAnalysis(analysisData, 'pdf'),
            icon: <Download className="w-4 h-4" />
          },
          {
            id: 'share_analysis',
            label: 'Share Analysis',
            type: 'button',
            action: () => shareAnalysis(analysisData),
            icon: <Share2 className="w-4 h-4" />
          }
        ]
      };
    } else if (message.toLowerCase().includes('stats') || message.toLowerCase().includes('statistics')) {
      response = {
        id: `stats_${Date.now()}`,
        type: 'bot',
        content: 'Here are the latest player statistics:',
        timestamp: new Date(),
        messageType: 'stats',
        data: {
          players: [
            { name: 'Lionel Messi', goals: 15, assists: 12, rating: 8.7 },
            { name: 'Kylian Mbappé', goals: 18, assists: 8, rating: 8.5 },
            { name: 'Erling Haaland', goals: 22, assists: 5, rating: 8.9 }
          ]
        }
      };
    } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('tutorial')) {
      startTutorial();
      return;
    } else {
      response = {
        id: `response_${Date.now()}`,
        type: 'bot',
        content: `I understand you're asking about "${message}". I can help you with match analysis, player statistics, tactical breakdowns, and predictions. Try asking me to "analyze a specific match" or "show player stats" for more detailed information.`,
        timestamp: new Date(),
        messageType: 'text',
        actions: [
          {
            id: 'suggest_analysis',
            label: 'Suggest Analysis',
            type: 'button',
            action: () => handleQuickAction('analyze_match'),
            icon: <BarChart3 className="w-4 h-4" />
          }
        ]
      };
    }

    setMessages(prev => [...prev, response]);
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

  const exportAnalysis = (data: AnalysisData, format: 'pdf' | 'excel') => {
    // Mock export functionality
    toast.success(`Analysis exported as ${format.toUpperCase()}`);
  };

  const shareAnalysis = (data: AnalysisData) => {
    // Mock share functionality
    navigator.clipboard.writeText(`Check out this analysis: ${data.teams.home} vs ${data.teams.away}`);
    toast.success('Analysis link copied to clipboard');
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
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
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
            <div className="text-sm">{message.content}</div>
            
            {/* Render analysis data */}
            {message.messageType === 'analysis' && message.data && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-semibold">{message.data.teams.home}</div>
                    <div>{message.data.score.home}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-semibold">{message.data.teams.away}</div>
                    <div>{message.data.score.away}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold">Key Statistics:</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Possession: {message.data.statistics.possession.home}% - {message.data.statistics.possession.away}%</div>
                    <div>Shots: {message.data.statistics.shots.home} - {message.data.statistics.shots.away}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Render player stats */}
            {message.messageType === 'stats' && message.data && (
              <div className="mt-3 space-y-2">
                {message.data.players.map((player: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                    <div className="font-semibold">{player.name}</div>
                    <div>Goals: {player.goals} | Assists: {player.assists} | Rating: {player.rating}</div>
                  </div>
                ))}
              </div>
            )}

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
                <span className="text-xs text-gray-500">Was this helpful?</span>
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
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="sm"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <img 
                src="/lovable-uploads/01b5bf86-f2e7-42cd-9465-4d0bb347d2ea.png" 
                alt="Football" 
                className="w-8 h-8"
              />
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
            className={`fixed bottom-24 right-6 z-40 bg-white rounded-lg shadow-2xl border border-gray-200 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Football Analysis AI</span>
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
                {/* Tutorial Overlay */}
                {showTutorial && (
                  <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-lg">
                    <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
                      <h3 className="font-semibold mb-2">{tutorialSteps[tutorialStep].title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{tutorialSteps[tutorialStep].description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Step {tutorialStep + 1} of {tutorialSteps.length}
                        </span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setShowTutorial(false)}>
                            Skip
                          </Button>
                          <Button size="sm" onClick={nextTutorialStep}>
                            {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 h-[480px]">
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

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about football analysis..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      size="sm"
                      className="px-3"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction('analyze_match')}
                      className="text-xs h-6"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analyze Match
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction('player_stats')}
                      className="text-xs h-6"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Player Stats
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startTutorial}
                      className="text-xs h-6"
                    >
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Help
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