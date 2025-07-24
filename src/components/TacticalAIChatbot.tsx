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
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response: TacticalMessage;
    const lowerMessage = message.toLowerCase();

    try {
      if (lowerMessage.includes('formation') || lowerMessage.includes('4-3-3') || lowerMessage.includes('4-4-2')) {
        const formation = extractFormation(message) || '4-3-3';
        response = {
          id: `formation_${Date.now()}`,
          type: 'bot',
          content: `🎯 **${formation} Formation Analysis**

**Tactical Overview:**
${getFormationAnalysis(formation, sport)}

**Key Principles:**
${getFormationPrinciples(formation)}

**Player Roles:**
${getPlayerRoles(formation)}

**Strengths & Weaknesses:**
✅ **Strengths:** ${getFormationStrengths(formation)}
⚠️ **Weaknesses:** ${getFormationWeaknesses(formation)}

**Recommended Against:**
${getFormationCounters(formation)}`,
          timestamp: new Date(),
          category: 'formation',
          actions: [
            {
              id: 'alternative_formation',
              label: 'Alternative Formations',
              type: 'button',
              action: () => setInputValue('Show me alternative formations'),
              icon: <Users className="w-4 h-4" />
            },
            {
              id: 'training_formation',
              label: 'Training Drills',
              type: 'button',
              action: () => setInputValue(`Training drills for ${formation}`),
              icon: <Target className="w-4 h-4" />
            }
          ]
        };
      }
      else if (lowerMessage.includes('counter') || lowerMessage.includes('against') || lowerMessage.includes('defend')) {
        response = {
          id: `counter_${Date.now()}`,
          type: 'bot',
          content: `🛡️ **Defensive Tactical Analysis**

**Counter-Pressing Strategies:**
${sport === 'soccer' 
  ? '• Immediate pressure after ball loss\n• Compact defensive block\n• Quick transitions to attack\n• Coordinated pressing triggers'
  : '• High-intensity pressing\n• Quick rotations\n• Aggressive man-marking\n• Fast counter-attacks'
}

**Defensive Positioning:**
• Maintain defensive shape
• Cover dangerous spaces
• Communication is key
• Anticipate opponent moves

**Key Tactical Adjustments:**
1. **Pressing Intensity** - Adjust based on game state
2. **Defensive Line** - High vs low block decisions
3. **Midfield Compactness** - Control central areas
4. **Wing Defense** - Prevent crosses and overlaps

**${sport === 'futsal' ? 'Futsal' : 'Football'}-Specific Tips:**
${sport === 'soccer'
  ? '• Use offside trap effectively\n• Coordinate defensive line\n• Protect set piece situations'
  : '• Quick defensive rotations\n• Aggressive man-marking\n• Prevent pivot play\n• Control goalkeeper area'
}`,
          timestamp: new Date(),
          category: 'strategy',
          actions: [
            {
              id: 'pressing_drills',
              label: 'Pressing Drills',
              type: 'button',
              action: () => setInputValue('Show me pressing training drills'),
              icon: <Zap className="w-4 h-4" />
            }
          ]
        };
      }
      else if (lowerMessage.includes('substitution') || lowerMessage.includes('change') || lowerMessage.includes('sub')) {
        response = {
          id: `substitution_${Date.now()}`,
          type: 'bot',
          content: `🔄 **Substitution Strategy Guide**

**When to Make Substitutions:**
• **Tactical Changes** - Formation or style adjustments
• **Fresh Legs** - Combat fatigue in key positions
• **Injury Prevention** - Protect tired players
• **Game State** - Winning, losing, or drawing scenarios

**Strategic Timing:**
${sport === 'soccer'
  ? '• **60-70 minutes** - Peak substitution window\n• **Half-time** - Major tactical changes\n• **75+ minutes** - Fresh energy injection\n• **Injury time** - Time management'
  : '• **15-20 minutes** - First half adjustments\n• **25-30 minutes** - Second half changes\n• **35+ minutes** - Final push or defense\n• **Unlimited subs** - Use rotation advantage'
}

**Position-Specific Considerations:**
• **Attackers** - Fresh pace and creativity
• **Midfielders** - Energy and pressing intensity
• **Defenders** - Stability and concentration
• **Goalkeeper** - Rare, only for tactical reasons

**Current Game Analysis:**
Based on your team's performance, consider:
1. Bringing fresh legs in midfield
2. Tactical switch to more defensive setup
3. Attacking substitution if chasing the game`,
          timestamp: new Date(),
          category: 'strategy',
          actions: [
            {
              id: 'sub_timing',
              label: 'Optimal Timing',
              type: 'button',
              action: () => setInputValue('When is the best time to substitute?'),
              icon: <Play className="w-4 h-4" />
            }
          ]
        };
      }
      else if (lowerMessage.includes('training') || lowerMessage.includes('drill') || lowerMessage.includes('practice')) {
        const focus = extractTrainingFocus(message);
        response = {
          id: `training_${Date.now()}`,
          type: 'bot',
          content: `🎯 **Training Drill Recommendations**

**Focus Area:** ${focus}

**Recommended Drills:**

**1. ${sport === 'soccer' ? 'Possession Squares' : 'Quick Passing Circuits'}**
• Duration: 15-20 minutes
• Players: ${sport === 'soccer' ? '8-12' : '6-10'}
• Objective: Improve ball retention and quick passing

**2. ${sport === 'soccer' ? 'Pressing Triggers' : 'High-Intensity Pressing'}**
• Duration: 12-15 minutes
• Players: Full team
• Objective: Coordinated defensive pressure

**3. ${sport === 'soccer' ? 'Transition Play' : 'Quick Transitions'}**
• Duration: 18-25 minutes
• Players: ${sport === 'soccer' ? '16-22' : '8-12'}
• Objective: Fast switches between phases

**4. Finishing Practice**
• Duration: 20 minutes
• Players: ${sport === 'soccer' ? '6-8' : '4-6'}
• Objective: Clinical finishing in ${sport === 'soccer' ? 'box' : 'small area'}

**Progressive Training Plan:**
Week 1-2: Technical foundation
Week 3-4: Tactical implementation
Week 5-6: Game situation practice`,
          timestamp: new Date(),
          category: 'suggestion',
          actions: [
            {
              id: 'detailed_drill',
              label: 'Detailed Instructions',
              type: 'button',
              action: () => setInputValue('Give me detailed instructions for possession drill'),
              icon: <Target className="w-4 h-4" />
            }
          ]
        };
      }
      else if (lowerMessage.includes('analyze') || lowerMessage.includes('performance') || lowerMessage.includes('weakness')) {
        response = {
          id: `analysis_${Date.now()}`,
          type: 'bot',
          content: `📊 **Team Performance Analysis**

**Current Tactical Assessment:**

**Attacking Phase:**
✅ Good ball circulation in midfield
✅ Effective wing play
⚠️ Limited creativity in final third
⚠️ Poor conversion rate in box

**Defensive Phase:**
✅ Strong defensive organization
✅ Good pressing coordination
⚠️ Vulnerable to quick counters
⚠️ Set piece defending needs work

**Transition Phases:**
✅ Quick defensive transitions
⚠️ Slow attacking build-up
⚠️ Poor counter-attack execution

**${sport === 'futsal' ? 'Futsal' : 'Football'}-Specific Insights:**
${sport === 'soccer'
  ? '• Improve crossing accuracy\n• Better offside trap timing\n• Enhance set piece delivery\n• Strengthen aerial duels'
  : '• Increase rotation speed\n• Improve pivot play\n• Better goalkeeper distribution\n• Enhance 1v1 situations'
}

**Priority Improvements:**
1. **High Priority:** Final third creativity
2. **Medium Priority:** Counter-attack speed
3. **Low Priority:** Set piece variations`,
          timestamp: new Date(),
          category: 'analysis',
          actions: [
            {
              id: 'improvement_plan',
              label: 'Improvement Plan',
              type: 'button',
              action: () => setInputValue('Create improvement plan for final third'),
              icon: <TrendingUp className="w-4 h-4" />
            }
          ]
        };
      }
      else {
        response = {
          id: `general_${Date.now()}`,
          type: 'bot',
          content: `🧠 **Tactical AI Assistant**

I understand you're asking about "${message}". As your tactical advisor, I can help with:

**🎯 Formation & Strategy**
• Formation analysis and recommendations
• Tactical adjustments during matches
• Counter-tactics against specific opponents

**⚡ In-Game Decisions**
• Substitution timing and strategy
• Tactical changes based on game state
• Real-time problem solving

**📊 Performance Analysis**
• Team strengths and weaknesses
• Individual player tactical roles
• Match preparation strategies

**🎨 Training & Development**
• Tactical training drills
• Formation practice sessions
• Strategic skill development

**${sport === 'futsal' ? 'Futsal' : 'Football'} Expertise:**
I'm specialized in ${sport === 'soccer' ? '11v11 football tactics' : '5v5 futsal strategies'} and can provide sport-specific advice.

Try asking: "How should I set up against a high-pressing team?" or "What formation works best for possession play?"`,
          timestamp: new Date(),
          category: 'general',
          actions: [
            {
              id: 'formation_help',
              label: 'Formation Help',
              type: 'button',
              action: () => setInputValue('What formation should I use?'),
              icon: <Users className="w-4 h-4" />
            },
            {
              id: 'tactical_problem',
              label: 'Solve Tactical Problem',
              type: 'button',
              action: () => setInputValue('We struggle against high press, help!'),
              icon: <Brain className="w-4 h-4" />
            }
          ]
        };
      }
    } catch (error) {
      response = {
        id: `error_${Date.now()}`,
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your tactical request. Please try again or ask me about formations, strategies, or training methods.',
        timestamp: new Date(),
        category: 'general'
      };
    }

    setMessages(prev => [...prev, response]);
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