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
import { toast } from 'sonner';

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
      // In production, this would call your email service
      const emailData = {
        to: 'suggestions@statsor.com',
        subject: `New Platform Suggestion from ${userInfo.name}`,
        body: `
New suggestion received from authenticated user:

User: ${userInfo.name} (${userInfo.email})
Suggestion: ${suggestion}
Timestamp: ${new Date().toISOString()}
User ID: ${userInfo.id}
User Role: ${userInfo.role || 'User'}

This suggestion was submitted through the football analysis chatbot.
        `
      };

      // Mock email sending - replace with actual email service
      console.log('Sending suggestion email:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
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

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response: ChatMessage;
    const lowerMessage = message.toLowerCase();

    try {
      // Handle suggestions
      if (lowerMessage.includes('suggest') || lowerMessage.includes('recommendation') || lowerMessage.includes('improve') || lowerMessage.includes('add') || lowerMessage.includes('feature')) {
        const emailResult = await sendSuggestionEmail(message, user);
        
        if (emailResult.success) {
          response = {
            id: `suggestion_${Date.now()}`,
            type: 'bot',
            content: `🌟 **Suggestion Received!**

Thank you for your valuable feedback! I've automatically forwarded your suggestion to our development team:

"${message}"

Our team reviews all suggestions weekly and prioritizes based on user impact. You'll receive updates if your suggestion is implemented.

**What happens next:**
✅ Development team review (within 48 hours)
📊 Impact assessment and feasibility study  
🚀 Implementation planning (if approved)
📧 Email notification with updates

Is there anything else about football analysis I can help you with?`,
            timestamp: new Date(),
            messageType: 'suggestion',
            actions: [
              {
                id: 'more_suggestions',
                label: 'Another Suggestion',
                type: 'button',
                action: () => setInputValue('I also suggest '),
                icon: <Star className="w-4 h-4" />
              },
              {
                id: 'analyze_something',
                label: 'Analyze Match',
                type: 'button',
                action: () => setInputValue('Analyze latest match'),
                icon: <BarChart3 className="w-4 h-4" />
              }
            ]
          };
        } else {
          response = {
            id: `suggestion_error_${Date.now()}`,
            type: 'bot',
            content: `I appreciate your suggestion, but I'm having trouble forwarding it right now. Please try again in a moment, or you can contact us directly at suggestions@statsor.com.`,
            timestamp: new Date(),
            messageType: 'text'
          };
        }
      }
      // Handle match analysis
      else if (lowerMessage.includes('analyze') || lowerMessage.includes('match') || lowerMessage.includes('game')) {
        const analysisData = generateMockAnalysis(message);
        response = {
          id: `analysis_${Date.now()}`,
          type: 'bot',
          content: `🔍 **Match Analysis Complete**

**${analysisData.teams.home} ${analysisData.score.home} - ${analysisData.score.away} ${analysisData.teams.away}**
*${analysisData.league} • ${analysisData.date}*

**Key Statistics:**
• Possession: ${analysisData.statistics.possession.home}% - ${analysisData.statistics.possession.away}%
• Shots: ${analysisData.statistics.shots.home} - ${analysisData.statistics.shots.away}
• Shots on Target: ${analysisData.statistics.shotsOnTarget.home} - ${analysisData.statistics.shotsOnTarget.away}

**Key Moments:**
${analysisData.keyMoments.map(moment => `⚽ ${moment.minute}' - ${moment.description}`).join('\n')}

**Tactical Insights:**
${analysisData.insights.map(insight => `• ${insight}`).join('\n')}`,
          timestamp: new Date(),
          messageType: 'analysis',
          data: analysisData,
          actions: [
            {
              id: 'export_analysis',
              label: 'Export PDF',
              type: 'download',
              action: () => toast.success('Analysis exported as PDF'),
              icon: <Download className="w-4 h-4" />
            },
            {
              id: 'share_analysis',
              label: 'Share',
              type: 'button',
              action: () => {
                navigator.clipboard.writeText(`Match Analysis: ${analysisData.teams.home} vs ${analysisData.teams.away}`);
                toast.success('Analysis link copied to clipboard');
              },
              icon: <Share2 className="w-4 h-4" />
            }
          ]
        };
      }
      // Handle player statistics
      else if (lowerMessage.includes('stats') || lowerMessage.includes('statistics') || lowerMessage.includes('player')) {
        const playerName = extractPlayerName(message) || 'Lionel Messi';
        response = {
          id: `stats_${Date.now()}`,
          type: 'bot',
          content: `📊 **${playerName} - Current Season Stats**

**Performance Metrics:**
⚽ Goals: 15 (0.8 per game)
🎯 Assists: 12 (0.6 per game)  
📈 Rating: 8.7/10
🏃 Minutes: 1,350 (90% of available)

**Advanced Stats:**
• Shot Accuracy: 78%
• Pass Completion: 89%
• Key Passes: 3.2 per game
• Dribbles: 4.1 per game (68% success)

**Form Analysis:**
📈 Last 5 games: 4 goals, 3 assists
🔥 Current form: Excellent
📊 Consistency: 85%

**Comparison:**
Performing 15% above season average
Top 3 in league for creativity metrics`,
          timestamp: new Date(),
          messageType: 'stats',
          data: { playerName, stats: { goals: 15, assists: 12, rating: 8.7 } },
          actions: [
            {
              id: 'compare_players',
              label: 'Compare Players',
              type: 'button',
              action: () => setInputValue(`Compare ${playerName} with `),
              icon: <Users className="w-4 h-4" />
            },
            {
              id: 'player_analysis',
              label: 'Deep Analysis',
              type: 'button',
              action: () => setInputValue(`Detailed analysis of ${playerName} performance`),
              icon: <TrendingUp className="w-4 h-4" />
            }
          ]
        };
      }
      // Handle predictions
      else if (lowerMessage.includes('predict') || lowerMessage.includes('prediction') || lowerMessage.includes('forecast')) {
        const teams = extractTeamNames(message);
        response = {
          id: `prediction_${Date.now()}`,
          type: 'bot',
          content: `🔮 **Match Prediction Analysis**

**${teams.home || 'Team A'} vs ${teams.away || 'Team B'}**

**Prediction Model Results:**
🏆 **Most Likely Outcome:** ${teams.home || 'Team A'} Win (65%)
📊 **Probability Breakdown:**
• ${teams.home || 'Team A'} Win: 65%
• Draw: 22%  
• ${teams.away || 'Team B'} Win: 13%

**Key Factors:**
✅ Home advantage (+15%)
✅ Recent form (+20%)
✅ Head-to-head record (+10%)
⚠️ Key player injuries (-5%)

**Score Prediction:** 2-1
**Confidence Level:** 78%

**Betting Insights:**
• Over 2.5 Goals: 72% probability
• Both Teams to Score: 68%
• First Goal: ${teams.home || 'Team A'} (58%)`,
          timestamp: new Date(),
          messageType: 'analysis',
          actions: [
            {
              id: 'detailed_prediction',
              label: 'Detailed Analysis',
              type: 'button',
              action: () => setInputValue('Detailed prediction analysis with player impact'),
              icon: <Target className="w-4 h-4" />
            }
          ]
        };
      }
      // Handle tactical questions
      else if (lowerMessage.includes('tactical') || lowerMessage.includes('formation') || lowerMessage.includes('strategy')) {
        response = {
          id: `tactical_${Date.now()}`,
          type: 'bot',
          content: `🎯 **Tactical Analysis**

**Formation Breakdown:**
📐 **4-3-3 Formation Analysis**

**Strengths:**
✅ Width in attack through wingers
✅ Midfield control with 3 players
✅ High pressing capability
✅ Flexible attacking patterns

**Weaknesses:**
⚠️ Vulnerable to counter-attacks
⚠️ Requires high work rate from wingers
⚠️ Can be outnumbered in midfield vs 4-4-2

**Key Tactical Principles:**
• Maintain possession through midfield triangle
• Create overloads on flanks
• Press high to win ball in final third
• Quick transitions from defense to attack

**Player Roles:**
🥅 GK: Sweeper-keeper
🛡️ CB: Ball-playing defenders
⚡ FB: Attacking fullbacks
🎯 CM: Box-to-box midfielder
🎨 AM: Creative playmaker
⚽ W: Inside forwards`,
          timestamp: new Date(),
          messageType: 'analysis',
          actions: [
            {
              id: 'formation_comparison',
              label: 'Compare Formations',
              type: 'button',
              action: () => setInputValue('Compare 4-3-3 vs 4-2-3-1 formations'),
              icon: <Activity className="w-4 h-4" />
            }
          ]
        };
      }
      // Handle help requests
      else if (lowerMessage.includes('help') || lowerMessage.includes('tutorial') || lowerMessage.includes('how')) {
        response = {
          id: `help_${Date.now()}`,
          type: 'bot',
          content: `🤖 **Football Analysis Assistant Help**

**What I can do for you:**

🔍 **Match Analysis**
• "Analyze Real Madrid vs Barcelona"
• "Breakdown of yesterday's El Clasico"
• "Tactical analysis of Liverpool vs City"

📊 **Player Statistics**  
• "Show me Messi's stats"
• "Compare Ronaldo and Messi"
• "Haaland performance this season"

🎯 **Tactical Insights**
• "Explain 4-3-3 formation"
• "Best formation against high press"
• "Tactical trends in modern football"

🔮 **Predictions**
• "Predict Arsenal vs Chelsea"
• "Who will win the Champions League"
• "Transfer predictions for summer"

💡 **Suggestions**
• "I suggest adding player heat maps"
• "Improve the statistics dashboard"

**Pro Tips:**
✨ Be specific with team/player names
🎯 Ask follow-up questions for deeper analysis
📊 Request exports for detailed reports
🔄 Rate my responses to improve accuracy`,
          timestamp: new Date(),
          messageType: 'tutorial',
          actions: [
            {
              id: 'start_tutorial',
              label: 'Interactive Tutorial',
              type: 'button',
              action: () => setShowTutorial(true),
              icon: <HelpCircle className="w-4 h-4" />
            },
            {
              id: 'example_analysis',
              label: 'Try Example',
              type: 'button',
              action: () => setInputValue('Analyze Manchester City vs Liverpool'),
              icon: <Zap className="w-4 h-4" />
            }
          ]
        };
      }
      // Default intelligent response
      else {
        response = {
          id: `response_${Date.now()}`,
          type: 'bot',
          content: `🤔 I understand you're asking about "${message}".

As your football analysis assistant, I can help you with:

⚽ **Match Analysis** - Detailed breakdowns of games
📊 **Player Statistics** - Performance metrics and comparisons  
🎯 **Tactical Insights** - Formation analysis and strategies
🔮 **Predictions** - Match outcomes and trends
💡 **Platform Suggestions** - Ideas to improve Statsor

**Try asking:**
• "Analyze the latest El Clasico"
• "Show me Mbappé's stats"
• "Predict Real Madrid vs PSG"
• "I suggest adding player heat maps"

What specific football topic interests you most?`,
          timestamp: new Date(),
          messageType: 'text',
          actions: [
            {
              id: 'suggest_analysis',
              label: 'Analyze Match',
              type: 'button',
              action: () => setInputValue('Analyze latest Champions League match'),
              icon: <BarChart3 className="w-4 h-4" />
            },
            {
              id: 'suggest_stats',
              label: 'Player Stats',
              type: 'button',
              action: () => setInputValue('Show me top scorer statistics'),
              icon: <Users className="w-4 h-4" />
            },
            {
              id: 'make_suggestion',
              label: 'Make Suggestion',
              type: 'button',
              action: () => setInputValue('I suggest '),
              icon: <Star className="w-4 h-4" />
            }
          ]
        };
      }
    } catch (error) {
      response = {
        id: `error_${Date.now()}`,
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your request. Please try again or ask me something else about football analysis.',
        timestamp: new Date(),
        messageType: 'text'
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
      {/* Chat Toggle Button - Always visible and perfectly positioned */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-xl border-4 border-white"
          size="sm"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <img 
                src="/lovable-uploads/01b5bf86-f2e7-42cd-9465-4d0bb347d2ea.png" 
                alt="Football" 
                className="w-10 h-10"
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