import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Target, 
  TrendingUp,
  AlertCircle,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { subscriptionService } from '@/services/subscriptionService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'analysis' | 'suggestion';
}

interface TacticalChatProps {
  userId: string;
  teamId?: string;
  matchId?: string;
}

const TacticalChat: React.FC<TacticalChatProps> = ({ userId, teamId, matchId }) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionSummary, setSubscriptionSummary] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize subscription summary
    const summary = subscriptionService.getSubscriptionSummary(userId);
    setSubscriptionSummary(summary);

    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      content: language === 'en' 
        ? 'Hello! I\'m your tactical AI assistant. I can help you analyze matches, suggest formations, and provide tactical insights. What would you like to know?'
        : '¡Hola! Soy tu asistente táctico de IA. Puedo ayudarte a analizar partidos, sugerir formaciones y proporcionar información táctica. ¿Qué te gustaría saber?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, [userId, language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const canAccessTacticalChat = () => {
    return subscriptionSummary?.canAccessAdvancedFeatures || subscriptionSummary?.isInTrial;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!canAccessTacticalChat()) {
      toast.error(language === 'en' 
        ? 'Tactical Chat is a premium feature. Upgrade your subscription to access it.'
        : 'El Chat Táctico es una función premium. Actualiza tu suscripción para acceder.'
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'analysis'
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update usage stats
      subscriptionService.updateUsageStats(userId, {
        featuresUsed: {
          ...subscriptionService.getUserUsageStats(userId).featuresUsed,
          tacticalChat: subscriptionService.getUserUsageStats(userId).featuresUsed.tacticalChat + 1
        }
      });

    } catch (error) {
      toast.error(language === 'en' ? 'Error sending message' : 'Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('formation') || input.includes('formación')) {
      return language === 'en'
        ? "Based on your team's style, I recommend a 4-3-3 formation. This provides good balance between attack and defense, with wingers who can stretch the opposition and a solid midfield trio. Would you like me to analyze specific player positions?"
        : "Basándome en el estilo de tu equipo, recomiendo una formación 4-3-3. Esto proporciona un buen equilibrio entre ataque y defensa, con extremos que pueden estirar a la oposición y un trío de mediocampo sólido. ¿Te gustaría que analice posiciones específicas de jugadores?";
    }
    
    if (input.includes('defense') || input.includes('defensa')) {
      return language === 'en'
        ? "For defensive organization, focus on maintaining compact lines and quick transitions. Your defenders should communicate well and maintain proper spacing. Consider implementing a high press to win the ball back quickly."
        : "Para la organización defensiva, enfócate en mantener líneas compactas y transiciones rápidas. Tus defensas deben comunicarse bien y mantener el espaciado adecuado. Considera implementar una presión alta para recuperar el balón rápidamente.";
    }
    
    if (input.includes('attack') || input.includes('ataque')) {
      return language === 'en'
        ? "In attack, look for quick combinations and movement off the ball. Your forwards should make diagonal runs to create space. Use overlapping fullbacks to provide width and create numerical advantages in wide areas."
        : "En ataque, busca combinaciones rápidas y movimiento sin balón. Tus delanteros deben hacer carreras diagonales para crear espacio. Usa laterales superpuestos para proporcionar amplitud y crear ventajas numéricas en zonas anchas.";
    }
    
    if (input.includes('counter') || input.includes('contraataque')) {
      return language === 'en'
        ? "For counter-attacking, position your fastest players in wide areas. Look for quick transitions when you win the ball back. Your midfielders should make forward runs to support the attack while maintaining defensive shape."
        : "Para el contraataque, posiciona a tus jugadores más rápidos en zonas anchas. Busca transiciones rápidas cuando recuperes el balón. Tus mediocampistas deben hacer carreras hacia adelante para apoyar el ataque mientras mantienen la forma defensiva.";
    }
    
    return language === 'en'
      ? "I understand you're asking about tactics. Could you be more specific? I can help with formations, defensive organization, attacking strategies, counter-attacking, set pieces, or player positioning."
      : "Entiendo que estás preguntando sobre tácticas. ¿Podrías ser más específico? Puedo ayudarte con formaciones, organización defensiva, estrategias de ataque, contraataques, jugadas a balón parado o posicionamiento de jugadores.";
  };

  const getMessageIcon = (message: Message) => {
    if (message.sender === 'ai') {
      return <Bot className="h-5 w-5 text-green-600" />;
    }
    return <User className="h-5 w-5 text-blue-600" />;
  };

  const getMessageBadge = (message: Message) => {
    if (message.type === 'analysis') {
      return (
        <Badge variant="outline" className="text-xs">
          <Target className="h-3 w-3 mr-1" />
          {language === 'en' ? 'Analysis' : 'Análisis'}
        </Badge>
      );
    }
    if (message.type === 'suggestion') {
      return (
        <Badge variant="outline" className="text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          {language === 'en' ? 'Suggestion' : 'Sugerencia'}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {language === 'en' ? 'Tactical Chat' : 'Chat Táctico'}
            </h2>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'AI-powered tactical analysis' : 'Análisis táctico con IA'}
            </p>
          </div>
        </div>
        
        {!canAccessTacticalChat() && (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Crown className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Premium' : 'Premium'}
          </Badge>
        )}
      </div>

      {/* Subscription Warning */}
      {!canAccessTacticalChat() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-800">
                {language === 'en' ? 'Premium Feature' : 'Función Premium'}
              </h3>
              <p className="text-sm text-orange-700">
                {language === 'en' 
                  ? 'Upgrade your subscription to access advanced tactical analysis and AI-powered insights.'
                  : 'Actualiza tu suscripción para acceder a análisis táctico avanzado e información impulsada por IA.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Interface */}
      <Card className="h-96">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {language === 'en' ? 'Tactical Assistant' : 'Asistente Táctico'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getMessageIcon(message)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex flex-col space-y-1 ${
                      message.sender === 'user' ? 'items-end' : 'items-start'
                    }`}>
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getMessageBadge(message)}
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-5 w-5 text-green-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'en' 
                  ? 'Ask about tactics, formations, or strategy...'
                  : 'Pregunta sobre tácticas, formaciones o estrategia...'
                }
                disabled={!canAccessTacticalChat() || isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!canAccessTacticalChat() || isLoading || !inputMessage.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Suggestions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">
          {language === 'en' ? 'Quick Questions' : 'Preguntas Rápidas'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            language === 'en' ? 'Best formation?' : '¿Mejor formación?',
            language === 'en' ? 'Defensive strategy?' : '¿Estrategia defensiva?',
            language === 'en' ? 'Attack patterns?' : '¿Patrones de ataque?',
            language === 'en' ? 'Counter-attack tips?' : '¿Consejos de contraataque?'
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputMessage(suggestion)}
              disabled={!canAccessTacticalChat()}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TacticalChat; 