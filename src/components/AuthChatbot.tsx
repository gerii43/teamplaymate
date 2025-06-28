import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Shield, 
  Key, 
  HelpCircle,
  Mail,
  Settings,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  RefreshCw,
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  AlertCircle,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  messageType?: 'text' | 'action' | 'suggestion' | 'help';
  actions?: ChatAction[];
  rating?: number;
}

interface ChatAction {
  id: string;
  label: string;
  type: 'button' | 'link' | 'email';
  action: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'destructive';
}

export const AuthChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Initialize with welcome message
  useEffect(() => {
    if (showWelcome && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: `Welcome! I'm your intelligent account management assistant, designed to help with all your authentication needs while ensuring maximum security and convenience.

How can I assist you today? You can:
• Sign in or create an account
• Reset your password
• Learn about security features
• Get technical support
• Ask any account-related questions

I'm equipped to handle both structured commands and natural conversations. Feel free to type your request in any format - whether it's a number, direct question, or general inquiry about accounts and security.`,
        timestamp: new Date(),
        messageType: 'text',
        actions: [
          {
            id: 'signin',
            label: 'Sign In',
            type: 'link',
            action: () => window.location.href = '/signin',
            icon: <LogIn className="w-4 h-4" />,
            variant: 'default'
          },
          {
            id: 'signup',
            label: 'Create Account',
            type: 'link',
            action: () => window.location.href = '/signup',
            icon: <UserPlus className="w-4 h-4" />,
            variant: 'outline'
          },
          {
            id: 'help',
            label: 'Get Help',
            type: 'button',
            action: () => handleQuickAction('help'),
            icon: <HelpCircle className="w-4 h-4" />,
            variant: 'outline'
          }
        ]
      };
      setMessages([welcomeMessage]);
      setShowWelcome(false);
    }
  }, [showWelcome, messages.length]);

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
      case 'signin':
        setInputValue('I want to sign in to my account');
        break;
      case 'signup':
        setInputValue('I want to create a new account');
        break;
      case 'help':
        setInputValue('I need help with my account');
        break;
      case 'reset':
        setInputValue('I forgot my password and need to reset it');
        break;
      case 'security':
        setInputValue('Tell me about security features');
        break;
    }
  };

  const sendSuggestionEmail = async (suggestion: string, userContext: string) => {
    try {
      // In production, this would call your email service
      const emailData = {
        to: 'suggestions@statsor.com',
        subject: 'New Platform Suggestion from Pre-Auth User',
        body: `
New suggestion received from a visitor:

Suggestion: ${suggestion}
Context: ${userContext}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
Page: ${window.location.href}

This suggestion was submitted through the authentication chatbot.
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

  const processMessage = async (message: string) => {
    setIsTyping(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    let response: ChatMessage;
    const lowerMessage = message.toLowerCase();

    try {
      // Handle suggestions
      if (lowerMessage.includes('suggest') || lowerMessage.includes('recommendation') || lowerMessage.includes('improve')) {
        const emailResult = await sendSuggestionEmail(message, 'Pre-authentication user suggestion');
        
        if (emailResult.success) {
          response = {
            id: `suggestion_${Date.now()}`,
            type: 'bot',
            content: `Thank you for your valuable suggestion! I've forwarded your feedback directly to our development team. They review all suggestions regularly and your input helps us improve Statsor.

Your suggestion: "${message}"

Is there anything else I can help you with regarding account creation or sign-in?`,
            timestamp: new Date(),
            messageType: 'suggestion',
            actions: [
              {
                id: 'more_suggestions',
                label: 'Share Another Idea',
                type: 'button',
                action: () => setInputValue('I have another suggestion: '),
                icon: <Star className="w-4 h-4" />
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
      // Handle sign-in requests
      else if (lowerMessage.includes('sign in') || lowerMessage.includes('login') || lowerMessage.includes('log in')) {
        response = {
          id: `signin_${Date.now()}`,
          type: 'bot',
          content: `I'll help you sign in to your Statsor account! You have several secure options:

🔐 **Email & Password**: Use your registered email and password
🚀 **Google Sign-In**: Quick authentication with your Google account
🔑 **Password Reset**: If you've forgotten your password

All sign-in methods use enterprise-grade security with encryption and multi-factor authentication options.`,
          timestamp: new Date(),
          messageType: 'action',
          actions: [
            {
              id: 'goto_signin',
              label: 'Go to Sign In',
              type: 'link',
              action: () => window.location.href = '/signin',
              icon: <LogIn className="w-4 h-4" />,
              variant: 'default'
            },
            {
              id: 'forgot_password',
              label: 'Reset Password',
              type: 'button',
              action: () => handleQuickAction('reset'),
              icon: <Key className="w-4 h-4" />,
              variant: 'outline'
            }
          ]
        };
      }
      // Handle sign-up requests
      else if (lowerMessage.includes('sign up') || lowerMessage.includes('create account') || lowerMessage.includes('register')) {
        response = {
          id: `signup_${Date.now()}`,
          type: 'bot',
          content: `Excellent! Creating a Statsor account gives you access to powerful football analysis tools. Here's what you'll get:

✅ **Complete Team Management**: Track players, matches, and statistics
✅ **Advanced Analytics**: AI-powered insights and performance metrics  
✅ **Multi-Device Sync**: Access your data anywhere, anytime
✅ **Secure Data Storage**: Enterprise-grade security for your information

The registration process takes less than 2 minutes and includes email verification for security.`,
          timestamp: new Date(),
          messageType: 'action',
          actions: [
            {
              id: 'goto_signup',
              label: 'Create Account',
              type: 'link',
              action: () => window.location.href = '/signup',
              icon: <UserPlus className="w-4 h-4" />,
              variant: 'default'
            },
            {
              id: 'learn_more',
              label: 'Learn More',
              type: 'button',
              action: () => setInputValue('Tell me more about Statsor features'),
              icon: <HelpCircle className="w-4 h-4" />,
              variant: 'outline'
            }
          ]
        };
      }
      // Handle password reset
      else if (lowerMessage.includes('password') || lowerMessage.includes('reset') || lowerMessage.includes('forgot')) {
        response = {
          id: `reset_${Date.now()}`,
          type: 'bot',
          content: `No worries! Password resets are quick and secure with Statsor:

🔄 **Reset Process**:
1. Enter your registered email address
2. Check your inbox for a secure reset link
3. Create a new strong password
4. Sign in with your new credentials

🛡️ **Security Features**:
• Reset links expire in 15 minutes for security
• Email verification required
• Password strength validation
• Optional two-factor authentication

Would you like me to guide you to the password reset page?`,
          timestamp: new Date(),
          messageType: 'action',
          actions: [
            {
              id: 'reset_password',
              label: 'Reset Password',
              type: 'link',
              action: () => window.location.href = '/signin',
              icon: <Key className="w-4 h-4" />,
              variant: 'default'
            },
            {
              id: 'security_tips',
              label: 'Security Tips',
              type: 'button',
              action: () => handleQuickAction('security'),
              icon: <Shield className="w-4 h-4" />,
              variant: 'outline'
            }
          ]
        };
      }
      // Handle security questions
      else if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('protection')) {
        response = {
          id: `security_${Date.now()}`,
          type: 'bot',
          content: `Statsor takes your security seriously! Here are our key security features:

🔒 **Data Protection**:
• End-to-end encryption for all data
• GDPR and LOPD compliant
• Regular security audits
• Secure cloud infrastructure

🛡️ **Account Security**:
• Two-factor authentication (2FA)
• Strong password requirements
• Session timeout protection
• Login attempt monitoring

🔐 **Privacy Controls**:
• Granular privacy settings
• Data export capabilities
• Account deletion options
• Transparent data usage

Your football data and personal information are protected with enterprise-grade security.`,
          timestamp: new Date(),
          messageType: 'text',
          actions: [
            {
              id: 'enable_2fa',
              label: 'Learn About 2FA',
              type: 'button',
              action: () => setInputValue('How do I enable two-factor authentication?'),
              icon: <Shield className="w-4 h-4" />
            }
          ]
        };
      }
      // Handle help requests
      else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
        response = {
          id: `help_${Date.now()}`,
          type: 'bot',
          content: `I'm here to help! Here are the most common topics I can assist with:

🔧 **Account Issues**:
• Sign-in problems
• Password resets
• Account creation
• Email verification

📧 **Contact Options**:
• Live chat support (that's me!)
• Email: support@statsor.com
• FAQ section
• Video tutorials

🚀 **Quick Solutions**:
• Clear browser cache and cookies
• Check email spam folder
• Ensure JavaScript is enabled
• Try incognito/private browsing

What specific issue are you experiencing?`,
          timestamp: new Date(),
          messageType: 'help',
          actions: [
            {
              id: 'contact_support',
              label: 'Email Support',
              type: 'email',
              action: () => window.location.href = 'mailto:support@statsor.com',
              icon: <Mail className="w-4 h-4" />
            },
            {
              id: 'common_issues',
              label: 'Common Issues',
              type: 'button',
              action: () => setInputValue('Show me common sign-in problems'),
              icon: <HelpCircle className="w-4 h-4" />
            }
          ]
        };
      }
      // Handle feature questions
      else if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('statsor')) {
        response = {
          id: `features_${Date.now()}`,
          type: 'bot',
          content: `Statsor is a comprehensive football management platform! Here's what you can do:

⚽ **Team Management**:
• Player profiles and statistics
• Match scheduling and results
• Training session planning
• Attendance tracking

📊 **Advanced Analytics**:
• Performance metrics and trends
• Tactical analysis tools
• Comparison reports
• Predictive insights

🎯 **Smart Features**:
• AI-powered recommendations
• Real-time data sync
• Mobile and tablet support
• Offline functionality

💼 **Professional Tools**:
• Custom reports and exports
• Multi-team management
• Role-based access control
• Integration capabilities

Ready to experience the future of football management?`,
          timestamp: new Date(),
          messageType: 'text',
          actions: [
            {
              id: 'start_trial',
              label: 'Start Free Trial',
              type: 'link',
              action: () => window.location.href = '/signup',
              icon: <Star className="w-4 h-4" />,
              variant: 'default'
            },
            {
              id: 'view_demo',
              label: 'View Demo',
              type: 'button',
              action: () => {
                const demoSection = document.getElementById('demo');
                if (demoSection) {
                  demoSection.scrollIntoView({ behavior: 'smooth' });
                  setIsOpen(false);
                }
              },
              icon: <HelpCircle className="w-4 h-4" />
            }
          ]
        };
      }
      // Default response
      else {
        response = {
          id: `default_${Date.now()}`,
          type: 'bot',
          content: `I understand you're asking about "${message}". As your account management assistant, I'm specialized in helping with:

• **Account Creation** - Setting up your Statsor account
• **Sign-In Support** - Accessing your existing account  
• **Password Management** - Resets and security
• **Platform Information** - Features and capabilities
• **Technical Support** - Troubleshooting issues
• **Suggestions** - Feedback for our development team

Could you please rephrase your question to focus on one of these areas? I'm here to make your Statsor experience as smooth as possible!`,
          timestamp: new Date(),
          messageType: 'text',
          actions: [
            {
              id: 'get_started',
              label: 'Get Started',
              type: 'link',
              action: () => window.location.href = '/signup',
              icon: <UserPlus className="w-4 h-4" />
            },
            {
              id: 'need_help',
              label: 'I Need Help',
              type: 'button',
              action: () => handleQuickAction('help'),
              icon: <HelpCircle className="w-4 h-4" />
            }
          ]
        };
      }
    } catch (error) {
      response = {
        id: `error_${Date.now()}`,
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact our support team at support@statsor.com for immediate assistance.',
        timestamp: new Date(),
        messageType: 'text'
      };
    }

    setMessages(prev => [...prev, response]);
    setIsTyping(false);
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
            isUser ? 'bg-primary text-white ml-2' : 'bg-blue-100 text-blue-600 mr-2'
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
                    variant={action.variant || "outline"}
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
        className="fixed bottom-6 right-6 z-50"
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
              <MessageCircle className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Account Assistant</span>
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
                <div className="flex-1 overflow-y-auto p-4 h-[480px] bg-gray-50">
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
                          <Bot className="w-4 h-4 text-blue-600" />
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
                      placeholder="Ask about accounts, security, or features..."
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
                      onClick={() => handleQuickAction('signin')}
                      className="text-xs h-6"
                    >
                      <LogIn className="w-3 h-3 mr-1" />
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction('signup')}
                      className="text-xs h-6"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Sign Up
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction('help')}
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