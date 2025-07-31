import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isTyping?: boolean;
}

interface AuthChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AuthChatbot: React.FC<AuthChatbotProps> = ({ isOpen = false, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your authentication assistant. I can help you with login, registration, password recovery, and account management. What would you like to do today?",
      timestamp: new Date(),
      suggestions: ['Login', 'Register', 'Forgot Password', 'Account Help']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'chat' | 'login' | 'register' | 'recovery'>('chat');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register, resetPassword } = useAuth();
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (content: string, type: 'user' | 'bot', suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (callback: () => void) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
    callback();
  };

  const handleSuggestionClick = (suggestion: string) => {
    addMessage(suggestion, 'user');
    handleUserInput(suggestion);
  };

  const handleUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('login') || lowerInput.includes('sign in')) {
      setCurrentStep('login');
      await simulateTyping(() => {
        addMessage(
          "Great! Let's get you logged in. Please enter your email and password.",
          'bot',
          ['I forgot my password', 'Back to main menu']
        );
      });
    } else if (lowerInput.includes('register') || lowerInput.includes('sign up')) {
      setCurrentStep('register');
      await simulateTyping(() => {
        addMessage(
          "Perfect! Let's create your account. I'll guide you through the registration process.",
          'bot',
          ['I already have an account', 'Back to main menu']
        );
      });
    } else if (lowerInput.includes('forgot') || lowerInput.includes('password')) {
      setCurrentStep('recovery');
      await simulateTyping(() => {
        addMessage(
          "No worries! I can help you reset your password. Please enter your email address.",
          'bot',
          ['I remember my password', 'Back to main menu']
        );
      });
    } else if (lowerInput.includes('help') || lowerInput.includes('support')) {
      await simulateTyping(() => {
        addMessage(
          "I'm here to help! Here are some common authentication topics:\n\n" +
          "• **Login Issues**: Problems signing in\n" +
          "• **Registration**: Creating a new account\n" +
          "• **Password Recovery**: Resetting forgotten passwords\n" +
          "• **Account Security**: Two-factor authentication, security settings\n" +
          "• **Profile Management**: Updating personal information\n\n" +
          "What specific help do you need?",
          'bot',
          ['Login Issues', 'Account Security', 'Profile Management']
        );
      });
    } else if (lowerInput.includes('back') || lowerInput.includes('menu')) {
      setCurrentStep('chat');
      setFormData({ email: '', password: '', confirmPassword: '', name: '' });
      setErrors({});
      await simulateTyping(() => {
        addMessage(
          "Sure! I'm back to help you with anything authentication-related. What would you like to do?",
          'bot',
          ['Login', 'Register', 'Forgot Password', 'Account Help']
        );
      });
    } else {
      await simulateTyping(() => {
        addMessage(
          "I understand you're asking about '" + input + "'. Let me help you with that. " +
          "Would you like to login, register, or get help with your account?",
          'bot',
          ['Login', 'Register', 'Account Help']
        );
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    const userInput = inputValue;
    setInputValue('');
    
    await handleUserInput(userInput);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'login' || currentStep === 'register' || currentStep === 'recovery') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    if (currentStep === 'login' || currentStep === 'register') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (currentStep === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (currentStep === 'login') {
        await login(formData.email, formData.password);
        addMessage('Login successful! Welcome back!', 'bot');
        setCurrentStep('chat');
      } else if (currentStep === 'register') {
        await register(formData.email, formData.password, formData.name);
        addMessage('Registration successful! Welcome to TeamPlayMate!', 'bot');
        setCurrentStep('chat');
      } else if (currentStep === 'recovery') {
        await resetPassword(formData.email);
        addMessage('Password reset email sent! Check your inbox.', 'bot');
        setCurrentStep('chat');
      }
      
      setFormData({ email: '', password: '', confirmPassword: '', name: '' });
    } catch (error) {
      addMessage(`Sorry, there was an error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'bot');
    }
  };

  const renderForm = () => {
    if (currentStep === 'chat') return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 'login' && <Lock size={20} />}
            {currentStep === 'register' && <User size={20} />}
            {currentStep === 'recovery' && <Mail size={20} />}
            {currentStep === 'login' && 'Login'}
            {currentStep === 'register' && 'Register'}
            {currentStep === 'recovery' && 'Password Recovery'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {currentStep === 'register' && (
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className={cn(errors.email && "border-red-500")}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {(currentStep === 'login' || currentStep === 'register') && (
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className={cn(errors.password && "border-red-500")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
            )}

            {currentStep === 'register' && (
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your password"
                  className={cn(errors.confirmPassword && "border-red-500")}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {currentStep === 'login' && 'Login'}
                {currentStep === 'register' && 'Register'}
                {currentStep === 'recovery' && 'Send Reset Email'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setCurrentStep('chat');
                  setFormData({ email: '', password: '', confirmPassword: '', name: '' });
                  setErrors({});
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-background border border-border rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/bot-avatar.png" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot size={16} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Auth Assistant</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Sparkles size={12} className="mr-1" />
            AI Powered
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.type === 'user' && "flex-row-reverse"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.type === 'user' ? undefined : "/bot-avatar.png"} />
                <AvatarFallback className={cn(
                  message.type === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "flex-1 max-w-[80%]",
                message.type === 'user' && "text-right"
              )}>
                <div className={cn(
                  "rounded-lg p-3",
                  message.type === 'user' 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-muted"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary">
                  <Bot size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Form */}
      {renderForm()}

      {/* Input */}
      {currentStep === 'chat' && (
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="sm">
              <Send size={16} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthChatbot;