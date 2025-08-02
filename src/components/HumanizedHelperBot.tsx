import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X, 
  Minimize2,
  Maximize2,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Star,
  Zap,
  Globe,
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const HumanizedHelperBot: React.FC = () => {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [userMood, setUserMood] = useState<'neutral' | 'frustrated' | 'excited' | 'confused'>('neutral');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: language === 'en' 
        ? "Hi there! 👋 I'm your personal Statsor assistant. I'm here to help you discover how our platform can transform your football team management. What would you like to know about?" 
        : "¡Hola! 👋 Soy tu asistente personal de Statsor. Estoy aquí para ayudarte a descubrir cómo nuestra plataforma puede transformar la gestión de tu equipo de fútbol. ¿Qué te gustaría saber?",
      timestamp: new Date(),
      suggestions: [
        language === 'en' ? "Tell me about features" : "Cuéntame sobre las funciones",
        language === 'en' ? "How much does it cost?" : "¿Cuánto cuesta?",
        language === 'en' ? "Show me a demo" : "Muéstrame una demo"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced quick actions with more options
  const quickActions = [
    {
      icon: Sparkles,
      label: language === 'en' ? "Features" : "Funciones",
      color: "from-purple-500 to-purple-600",
      description: language === 'en' ? "Explore our tools" : "Explora nuestras herramientas"
    },
    {
      icon: TrendingUp,
      label: language === 'en' ? "Pricing" : "Precios", 
      color: "from-green-500 to-green-600",
      description: language === 'en' ? "See our plans" : "Ver nuestros planes"
    },
    {
      icon: Target,
      label: language === 'en' ? "Get Demo" : "Obtener Demo",
      color: "from-blue-500 to-blue-600",
      description: language === 'en' ? "Try it yourself" : "Pruébalo tú mismo"
    },
    {
      icon: Users,
      label: language === 'en' ? "Support" : "Soporte",
      color: "from-orange-500 to-orange-600",
      description: language === 'en' ? "Get help" : "Obtener ayuda"
    },
    {
      icon: Zap,
      label: language === 'en' ? "Quick Start" : "Inicio Rápido",
      color: "from-yellow-500 to-yellow-600",
      description: language === 'en' ? "Get started fast" : "Empieza rápido"
    },
    {
      icon: Star,
      label: language === 'en' ? "Success Stories" : "Casos de Éxito",
      color: "from-pink-500 to-pink-600",
      description: language === 'en' ? "See results" : "Ver resultados"
    }
  ];

  // Analyze user mood based on message content
  const analyzeUserMood = (message: string): 'neutral' | 'frustrated' | 'excited' | 'confused' => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('frustrated') || lowerMessage.includes('angry') || lowerMessage.includes('upset') || 
        lowerMessage.includes('frustrado') || lowerMessage.includes('enojado') || lowerMessage.includes('molesto')) {
      return 'frustrated';
    }
    
    if (lowerMessage.includes('excited') || lowerMessage.includes('amazing') || lowerMessage.includes('great') || 
        lowerMessage.includes('emocionado') || lowerMessage.includes('increíble') || lowerMessage.includes('genial')) {
      return 'excited';
    }
    
    if (lowerMessage.includes('confused') || lowerMessage.includes('not sure') || lowerMessage.includes('don\'t understand') || 
        lowerMessage.includes('confundido') || lowerMessage.includes('no estoy seguro') || lowerMessage.includes('no entiendo')) {
      return 'confused';
    }
    
    return 'neutral';
  };

  // Get emotional response based on user mood
  const getEmotionalResponse = (mood: 'neutral' | 'frustrated' | 'excited' | 'confused'): string => {
    switch(mood) {
      case 'frustrated':
        return language === 'en' ? "I understand this can be frustrating! 😔 Let me help you resolve this quickly." : "¡Entiendo que esto puede ser frustrante! 😔 Déjame ayudarte a resolverlo rápidamente.";
      case 'excited':
        return language === 'en' ? "I love your enthusiasm! 🎉 Let's make this even better!" : "¡Me encanta tu entusiasmo! 🎉 ¡Hagamos esto aún mejor!";
      case 'confused':
        return language === 'en' ? "No worries! 🤗 Let me break this down in a simpler way." : "¡No te preocupes! 🤗 Déjame explicarte esto de manera más simple.";
      default:
        return "";
    }
  };

  const botResponses: { [key: string]: { en: string; es: string; suggestions?: string[] } } = {
    features: {
      en: "🎯 Amazing question! Statsor is like having a professional football analyst in your pocket! Here's what makes us special:\n\n🚀 **Core Features:**\n• 📊 Real-time match statistics with live updates\n• 👥 Player performance tracking with detailed analytics\n• 📈 Advanced insights with AI-powered recommendations\n• 🤖 Smart tactical assistant that learns your style\n• 📱 Works completely offline - perfect for the pitch!\n• 📋 Automated reports that save you hours\n• 🏆 Supports both 11-a-side and futsal formats\n\n💡 **What really sets us apart:**\n• 🎯 Personalized coaching insights\n• ⚡ Lightning-fast setup (under 5 minutes)\n• 🔄 Seamless data sync across devices\n• 🎨 Beautiful, intuitive interface\n• 🌍 Multi-language support\n\nWould you like me to dive deeper into any of these features?",
      es: "🎯 ¡Excelente pregunta! ¡Statsor es como tener un analista profesional de fútbol en tu bolsillo! Esto es lo que nos hace especiales:\n\n🚀 **Funciones Principales:**\n• 📊 Estadísticas de partidos en tiempo real con actualizaciones en vivo\n• 👥 Seguimiento del rendimiento de jugadores con análisis detallado\n• 📈 Insights avanzados con recomendaciones impulsadas por IA\n• 🤖 Asistente táctico inteligente que aprende tu estilo\n• 📱 Funciona completamente sin conexión - ¡perfecto para el campo!\n• 📋 Informes automáticos que te ahorran horas\n• 🏆 Soporte para fútbol 11 y futsal\n\n💡 **Lo que realmente nos diferencia:**\n• 🎯 Insights de entrenamiento personalizados\n• ⚡ Configuración súper rápida (menos de 5 minutos)\n• 🔄 Sincronización perfecta de datos entre dispositivos\n• 🎨 Interfaz hermosa e intuitiva\n• 🌍 Soporte multiidioma\n\n¿Te gustaría que profundice en alguna de estas funciones?",
      suggestions: [
        language === 'en' ? "Show me the dashboard" : "Muéstrame el panel",
        language === 'en' ? "Tell me about AI features" : "Cuéntame sobre las funciones de IA",
        language === 'en' ? "How does offline mode work?" : "¿Cómo funciona el modo offline?",
        language === 'en' ? "What about pricing?" : "¿Qué hay sobre los precios?"
      ]
    },
    pricing: {
      en: "💰 Great question! We believe every coach deserves access to professional tools, so we've created flexible plans that grow with your team:\n\n🆓 **Starter Plan** - Always Free\n• 7-day free trial of all Pro features\n• 1 team, up to 20 players\n• Basic statistics and reports\n• Perfect for getting started\n\n⭐ **Pro Plan** - €299/year (€25/month)\n• 1 team included\n• All features + AI assistant\n• Real-time analytics and insights\n• Priority support\n• Advanced reporting\n• Mobile app access\n\n🏆 **Club Plan** - From €250/month\n• 6+ teams included\n• Multi-user management\n• Custom onboarding and training\n• Dedicated support manager\n• API access for integrations\n• White-label options\n\n🎁 **Special Offer:** Save 20% with annual billing!\n\nWhich plan sounds right for your team? I can help you choose!",
      es: "💰 ¡Excelente pregunta! Creemos que cada entrenador merece acceso a herramientas profesionales, por eso hemos creado planes flexibles que crecen con tu equipo:\n\n🆓 **Plan Starter** - Siempre Gratis\n• 7 días de prueba gratuita de todas las funciones Pro\n• 1 equipo, hasta 20 jugadores\n• Estadísticas básicas e informes\n• Perfecto para empezar\n\n⭐ **Plan Pro** - €299/año (€25/mes)\n• 1 equipo incluido\n• Todas las funciones + asistente IA\n• Análisis e insights en tiempo real\n• Soporte prioritario\n• Informes avanzados\n• Acceso a app móvil\n\n🏆 **Plan Club** - Desde €250/mes\n• 6+ equipos incluidos\n• Gestión multiusuario\n• Onboarding y entrenamiento personalizado\n• Gerente de soporte dedicado\n• Acceso API para integraciones\n• Opciones white-label\n\n🎁 **Oferta Especial:** ¡Ahorra 20% con facturación anual!\n\n¿Qué plan suena bien para tu equipo? ¡Puedo ayudarte a elegir!",
      suggestions: [
        language === 'en' ? "I want to try the free trial" : "Quiero probar la versión gratuita",
        language === 'en' ? "Tell me more about Pro" : "Cuéntame más sobre Pro",
        language === 'en' ? "I need Club pricing" : "Necesito precios de Club",
        language === 'en' ? "Show me a demo first" : "Muéstrame una demo primero"
      ]
    },
    demo: {
      en: "🎬 Fantastic! I'm excited to show you how Statsor can transform your coaching! Here's what we'll cover:\n\n1️⃣ **Quick Setup** - Get started in under 5 minutes\n2️⃣ **Live Demo** - See real-time match tracking in action\n3️⃣ **Player Analytics** - Watch performance insights come to life\n4️⃣ **AI Assistant** - Experience tactical recommendations\n5️⃣ **Offline Mode** - See how it works without internet\n\n🎯 **Demo Options:**\n• 🚀 **Interactive Demo** - Try it yourself right now\n• 📅 **Personalized Demo** - Schedule with our team\n• 🎥 **Video Walkthrough** - Watch at your own pace\n\nWhat would you prefer? I can start the interactive demo immediately, or we can schedule a personalized session where I'll show you exactly how it fits your specific needs!",
      es: "🎬 ¡Fantástico! ¡Estoy emocionado de mostrarte cómo Statsor puede transformar tu entrenamiento! Esto es lo que cubriremos:\n\n1️⃣ **Configuración Rápida** - Comienza en menos de 5 minutos\n2️⃣ **Demo en Vivo** - Ve el seguimiento de partidos en tiempo real\n3️⃣ **Análisis de Jugadores** - Observa cómo cobran vida los insights de rendimiento\n4️⃣ **Asistente IA** - Experimenta recomendaciones tácticas\n5️⃣ **Modo Offline** - Ve cómo funciona sin internet\n\n🎯 **Opciones de Demo:**\n• 🚀 **Demo Interactiva** - Pruébalo tú mismo ahora\n• 📅 **Demo Personalizada** - Programa con nuestro equipo\n• 🎥 **Recorrido en Video** - Mira a tu propio ritmo\n\n¿Qué prefieres? ¡Puedo iniciar la demo interactiva inmediatamente, o podemos programar una sesión personalizada donde te mostraré exactamente cómo se adapta a tus necesidades específicas!",
      suggestions: [
        language === 'en' ? "Start interactive demo" : "Iniciar demo interactiva",
        language === 'en' ? "Schedule personalized demo" : "Programar demo personalizada",
        language === 'en' ? "Show me video walkthrough" : "Muéstrame recorrido en video",
        language === 'en' ? "I have questions first" : "Tengo preguntas primero"
      ]
    },
    support: {
      en: "🛟 I'm here to help you succeed! Here are all the ways we support our coaches:\n\n📧 **Email Support** - contacto@statsor.com\n📞 **Phone Support** - +34 900 123 456 (Mon-Fri 9AM-6PM)\n💬 **Live Chat** - Available 24/7 (that's me!)\n📚 **Help Center** - Complete documentation and guides\n🎥 **Video Tutorials** - Step-by-step video guides\n👥 **Community Forum** - Connect with other coaches\n📱 **In-App Support** - Get help right from the app\n\n🎯 **What I can help with:**\n• Technical questions and troubleshooting\n• Feature explanations and best practices\n• Account setup and configuration\n• Training and onboarding\n• Billing and subscription questions\n\nWhat specific help do you need? I'm here to guide you through anything!",
      es: "🛟 ¡Estoy aquí para ayudarte a tener éxito! Aquí tienes todas las formas en que apoyamos a nuestros entrenadores:\n\n📧 **Soporte por Email** - contacto@statsor.com\n📞 **Soporte Telefónico** - +34 900 123 456 (Lun-Vie 9AM-6PM)\n💬 **Chat en Vivo** - Disponible 24/7 (¡ese soy yo!)\n📚 **Centro de Ayuda** - Documentación completa y guías\n🎥 **Tutoriales en Video** - Guías paso a paso en video\n👥 **Foro Comunitario** - Conéctate con otros entrenadores\n📱 **Soporte en la App** - Obtén ayuda directamente desde la app\n\n🎯 **Con qué puedo ayudarte:**\n• Preguntas técnicas y solución de problemas\n• Explicaciones de funciones y mejores prácticas\n• Configuración de cuenta y configuración\n• Entrenamiento y onboarding\n• Preguntas de facturación y suscripción\n\n¿Qué ayuda específica necesitas? ¡Estoy aquí para guiarte en todo!",
      suggestions: [
        language === 'en' ? "I need technical help" : "Necesito ayuda técnica",
        language === 'en' ? "Show me tutorials" : "Muéstrame tutoriales",
        language === 'en' ? "Contact support team" : "Contactar al equipo de soporte",
        language === 'en' ? "Join community forum" : "Unirse al foro comunitario"
      ]
    }
  };

  const getBotResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('feature') || lowerMessage.includes('función') || lowerMessage.includes('offer') || lowerMessage.includes('ofrece') || lowerMessage.includes('what') || lowerMessage.includes('qué')) {
      return {
        content: language === 'en' ? botResponses.features.en : botResponses.features.es,
        suggestions: botResponses.features.suggestions
      };
    }
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('cuesta') || lowerMessage.includes('precio') || lowerMessage.includes('plan')) {
      return {
        content: language === 'en' ? botResponses.pricing.en : botResponses.pricing.es,
        suggestions: botResponses.pricing.suggestions
      };
    }
    if (lowerMessage.includes('demo') || lowerMessage.includes('show') || lowerMessage.includes('muestra') || lowerMessage.includes('probar')) {
      return {
        content: language === 'en' ? botResponses.demo.en : botResponses.demo.es,
        suggestions: botResponses.demo.suggestions
      };
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('ayuda') || lowerMessage.includes('soporte')) {
      return {
        content: language === 'en' ? botResponses.support.en : botResponses.support.es,
        suggestions: botResponses.support.suggestions
      };
    }
    
    // Enhanced AI-like response with more human touch
    const timeOfDay = new Date().getHours();
    let greeting = '';
    if (timeOfDay < 12) {
      greeting = language === 'en' ? 'Good morning! 🌅' : '¡Buenos días! 🌅';
    } else if (timeOfDay < 18) {
      greeting = language === 'en' ? 'Good afternoon! ☀️' : '¡Buenas tardes! ☀️';
    } else {
      greeting = language === 'en' ? 'Good evening! 🌙' : '¡Buenas noches! 🌙';
    }
    
    // Default response with more personality
    return {
      content: language === 'en' 
        ? `${greeting} I'd love to help you with that! 🤔 Could you tell me a bit more about what you're looking for? I can help with:\n\n• 🎯 Features and capabilities\n• 💰 Pricing and plans\n• 🎬 Demos and trials\n• 🛟 Support and help\n\nWhat interests you most?`
        : `${greeting} ¡Me encantaría ayudarte con eso! 🤔 ¿Podrías contarme un poco más sobre lo que buscas? Puedo ayudarte con:\n\n• 🎯 Funciones y capacidades\n• 💰 Precios y planes\n• 🎬 Demos y pruebas\n• 🛟 Soporte y ayuda\n\n¿Qué te interesa más?`,
      suggestions: [
        language === 'en' ? "Tell me about features" : "Cuéntame sobre las funciones",
        language === 'en' ? "What are the pricing plans?" : "¿Cuáles son los planes de precios?",
        language === 'en' ? "I want to see a demo" : "Quiero ver una demo"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Analyze user mood
    const mood = analyzeUserMood(inputValue);
    setUserMood(mood);

    // Add to conversation history
    setConversationHistory(prev => [...prev, inputValue]);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Enhanced typing delay with more human-like variation
    const baseDelay = 600;
    const randomDelay = Math.random() * 1200;
    const messageLengthDelay = Math.min(inputValue.length * 20, 800);
    const typingDelay = baseDelay + randomDelay + messageLengthDelay;
    
    await new Promise(resolve => setTimeout(resolve, typingDelay));

    // Enhanced response generation with emotional awareness
    const response = await generateEnhancedResponse(inputValue, mood);
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const generateEnhancedResponse = async (userMessage: string, mood: 'neutral' | 'frustrated' | 'excited' | 'confused'): Promise<{ content: string; suggestions?: string[] }> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Add emotional response if user is not neutral
    const emotionalPrefix = mood !== 'neutral' ? getEmotionalResponse(mood) + "\n\n" : "";
    
    // Enhanced keyword detection with more natural language processing
    const keywords = {
      features: ['feature', 'función', 'offer', 'ofrece', 'what', 'qué', 'can', 'puede', 'do', 'hace', 'capability', 'capacidad'],
      pricing: ['cost', 'price', 'cuesta', 'precio', 'plan', 'plan', 'money', 'dinero', 'pay', 'pagar', 'subscription', 'suscripción'],
      demo: ['demo', 'show', 'muestra', 'probar', 'try', 'intentar', 'test', 'prueba', 'see', 'ver', 'experience', 'experiencia'],
      support: ['help', 'support', 'ayuda', 'soporte', 'problem', 'problema', 'issue', 'problema', 'trouble', 'dificultad'],
      technical: ['technical', 'técnico', 'bug', 'error', 'error', 'broken', 'roto', 'not working', 'no funciona'],
      comparison: ['compare', 'comparar', 'vs', 'versus', 'difference', 'diferencia', 'better', 'mejor', 'best', 'mejor'],
      integration: ['integrate', 'integrar', 'api', 'connect', 'conectar', 'sync', 'sincronizar', 'import', 'importar'],
      training: ['training', 'entrenamiento', 'learn', 'aprender', 'tutorial', 'guide', 'guía', 'how to', 'cómo'],
      quickstart: ['quick', 'start', 'rápido', 'inicio', 'begin', 'empezar', 'setup', 'configurar'],
      success: ['success', 'story', 'case', 'result', 'éxito', 'historia', 'caso', 'resultado', 'testimonial', 'testimonio']
    };

    // Check for multiple keyword matches and provide more contextual responses
    const matchedCategories = Object.entries(keywords).filter(([category, words]) =>
      words.some(word => lowerMessage.includes(word))
    );

    // Handle multiple category matches
    if (matchedCategories.length > 1) {
      return {
        content: emotionalPrefix + (language === 'en' 
          ? "I see you're asking about multiple aspects! 🤔 Let me break this down for you:\n\n" +
            matchedCategories.map(([category]) => {
              switch(category) {
                case 'features': return "• 🎯 **Features** - Our comprehensive football management tools";
                case 'pricing': return "• 💰 **Pricing** - Flexible plans starting from free";
                case 'demo': return "• 🎬 **Demo** - See it in action with interactive demos";
                case 'support': return "• 🛟 **Support** - 24/7 help and comprehensive resources";
                case 'quickstart': return "• ⚡ **Quick Start** - Get running in minutes";
                case 'success': return "• 🏆 **Success Stories** - See real results";
                default: return "";
              }
            }).join('\n') + "\n\nWhich aspect would you like me to focus on first?"
          : "¡Veo que preguntas sobre múltiples aspectos! 🤔 Déjame desglosarte esto:\n\n" +
            matchedCategories.map(([category]) => {
              switch(category) {
                case 'features': return "• 🎯 **Funciones** - Nuestras herramientas completas de gestión de fútbol";
                case 'pricing': return "• 💰 **Precios** - Planes flexibles que empiezan gratis";
                case 'demo': return "• 🎬 **Demo** - Vélo en acción con demos interactivas";
                case 'support': return "• 🛟 **Soporte** - Ayuda 24/7 y recursos completos";
                case 'quickstart': return "• ⚡ **Inicio Rápido** - Funcionando en minutos";
                case 'success': return "• 🏆 **Casos de Éxito** - Ver resultados reales";
                default: return "";
              }
            }).join('\n') + "\n\n¿En qué aspecto te gustaría que me enfoque primero?"),
        suggestions: [
          language === 'en' ? "Tell me about features" : "Cuéntame sobre las funciones",
          language === 'en' ? "What about pricing?" : "¿Qué hay sobre los precios?",
          language === 'en' ? "Show me a demo" : "Muéstrame una demo"
        ]
      };
    }

    // Handle specific category matches
    if (matchedCategories.length === 1) {
      const [category] = matchedCategories[0];
      switch(category) {
        case 'features':
          return {
            content: emotionalPrefix + (language === 'en' ? botResponses.features.en : botResponses.features.es),
            suggestions: botResponses.features.suggestions
          };
        case 'pricing':
          return {
            content: emotionalPrefix + (language === 'en' ? botResponses.pricing.en : botResponses.pricing.es),
            suggestions: botResponses.pricing.suggestions
          };
        case 'demo':
          return {
            content: emotionalPrefix + (language === 'en' ? botResponses.demo.en : botResponses.demo.es),
            suggestions: botResponses.demo.suggestions
          };
        case 'support':
          return {
            content: emotionalPrefix + (language === 'en' ? botResponses.support.en : botResponses.support.es),
            suggestions: botResponses.support.suggestions
          };
        case 'quickstart':
          return {
            content: emotionalPrefix + (language === 'en'
              ? "⚡ Perfect! Let's get you started with Statsor in just a few minutes:\n\n**Step 1: Quick Setup** 🚀\n• Download the app (iOS/Android)\n• Create your account in 30 seconds\n• Add your team details\n\n**Step 2: First Match** ⚽\n• Start a new match session\n• Add your players (or import from Excel)\n• Begin tracking in real-time\n\n**Step 3: See Results** 📊\n• View live statistics\n• Get AI insights\n• Export reports\n\n🎯 **Time to setup:** Under 5 minutes!\n🎯 **First results:** Immediate!\n\nReady to get started?"
              : "⚡ ¡Perfecto! Vamos a ponerte en marcha con Statsor en solo unos minutos:\n\n**Paso 1: Configuración Rápida** 🚀\n• Descarga la app (iOS/Android)\n• Crea tu cuenta en 30 segundos\n• Añade los detalles de tu equipo\n\n**Paso 2: Primer Partido** ⚽\n• Inicia una nueva sesión de partido\n• Añade tus jugadores (o importa desde Excel)\n• Comienza a rastrear en tiempo real\n\n**Paso 3: Ver Resultados** 📊\n• Ve estadísticas en vivo\n• Obtén insights de IA\n• Exporta informes\n\n🎯 **Tiempo de configuración:** ¡Menos de 5 minutos!\n🎯 **Primeros resultados:** ¡Inmediatos!\n\n¿Listo para empezar?"),
            suggestions: [
              language === 'en' ? "Download the app" : "Descargar la app",
              language === 'en' ? "Show me setup guide" : "Muéstrame guía de configuración",
              language === 'en' ? "I need help with setup" : "Necesito ayuda con la configuración"
            ]
          };
        case 'success':
          return {
            content: emotionalPrefix + (language === 'en'
              ? "🏆 Amazing! Here are some incredible success stories from coaches using Statsor:\n\n**Real Results from Real Coaches:**\n\n👨‍💼 **Coach Carlos (Barcelona)**\n• Improved team performance by 23%\n• Reduced training time by 40%\n• Won regional championship\n\n👩‍💼 **Coach Maria (Madrid)**\n• Increased player engagement by 67%\n• Better player development tracking\n• Promoted to head coach\n\n👨‍💼 **Coach David (Valencia)**\n• Saved 15 hours per week on admin\n• More strategic decision making\n• Team qualified for playoffs\n\n🎯 **Average Results:**\n• 25% improvement in team performance\n• 50% reduction in administrative work\n• 90% of coaches see results in first month\n\nWould you like to hear more specific stories or see how you can achieve similar results?"
              : "🏆 ¡Increíble! Aquí tienes algunas historias de éxito increíbles de entrenadores que usan Statsor:\n\n**Resultados Reales de Entrenadores Reales:**\n\n👨‍💼 **Entrenador Carlos (Barcelona)**\n• Mejoró el rendimiento del equipo en 23%\n• Redujo el tiempo de entrenamiento en 40%\n• Ganó el campeonato regional\n\n👩‍💼 **Entrenadora Maria (Madrid)**\n• Aumentó el compromiso de los jugadores en 67%\n• Mejor seguimiento del desarrollo de jugadores\n• Promovida a entrenadora principal\n\n👨‍💼 **Entrenador David (Valencia)**\n• Ahorró 15 horas por semana en administración\n• Toma de decisiones más estratégica\n• Equipo clasificado para playoffs\n\n🎯 **Resultados Promedio:**\n• 25% de mejora en el rendimiento del equipo\n• 50% de reducción en trabajo administrativo\n• 90% de entrenadores ven resultados en el primer mes\n\n¿Te gustaría escuchar más historias específicas o ver cómo puedes lograr resultados similares?"),
            suggestions: [
              language === 'en' ? "Tell me more stories" : "Cuéntame más historias",
              language === 'en' ? "How can I get these results?" : "¿Cómo puedo obtener estos resultados?",
              language === 'en' ? "Show me testimonials" : "Muéstrame testimonios"
            ]
          };
        case 'technical':
          return {
            content: emotionalPrefix + (language === 'en' 
              ? "🔧 I understand you're having a technical issue! Let me help you resolve this quickly:\n\n• 📱 **App Issues** - Try restarting the app\n• 🔄 **Sync Problems** - Check your internet connection\n• 📊 **Data Issues** - Contact our support team\n• 🆘 **Emergency** - Call +34 900 123 456\n\nCan you tell me more specifically what's not working?"
              : "🔧 ¡Entiendo que tienes un problema técnico! Déjame ayudarte a resolverlo rápidamente:\n\n• 📱 **Problemas de App** - Intenta reiniciar la aplicación\n• 🔄 **Problemas de Sincronización** - Verifica tu conexión a internet\n• 📊 **Problemas de Datos** - Contacta a nuestro equipo de soporte\n• 🆘 **Emergencia** - Llama al +34 900 123 456\n\n¿Puedes contarme más específicamente qué no está funcionando?"),
            suggestions: [
              language === 'en' ? "Contact support team" : "Contactar al equipo de soporte",
              language === 'en' ? "Show me troubleshooting guide" : "Muéstrame guía de solución",
              language === 'en' ? "I need immediate help" : "Necesito ayuda inmediata"
            ]
          };
        case 'comparison':
          return {
            content: emotionalPrefix + (language === 'en'
              ? "🔄 Great question! Let me compare Statsor with other solutions:\n\n**Statsor Advantages:**\n• 🎯 **Specialized** - Built specifically for football\n• 📱 **Offline First** - Works without internet\n• 🤖 **AI Powered** - Smart tactical insights\n• ⚡ **Fast Setup** - Ready in 5 minutes\n• 💰 **Better Value** - More features, better pricing\n\n**vs. Generic Solutions:**\n• 📊 More detailed football analytics\n• 🏆 Better player performance tracking\n• 🎨 More intuitive interface\n• 🌍 Better multi-language support\n\nWould you like me to show you a detailed comparison?"
              : "🔄 ¡Excelente pregunta! Déjame comparar Statsor con otras soluciones:\n\n**Ventajas de Statsor:**\n• 🎯 **Especializado** - Construido específicamente para fútbol\n• 📱 **Offline First** - Funciona sin internet\n• 🤖 **Con IA** - Insights tácticos inteligentes\n• ⚡ **Configuración Rápida** - Listo en 5 minutos\n• 💰 **Mejor Valor** - Más funciones, mejor precio\n\n**vs. Soluciones Genéricas:**\n• 📊 Análisis de fútbol más detallado\n• 🏆 Mejor seguimiento del rendimiento de jugadores\n• 🎨 Interfaz más intuitiva\n• 🌍 Mejor soporte multiidioma\n\n¿Te gustaría que te muestre una comparación detallada?"),
            suggestions: [
              language === 'en' ? "Show detailed comparison" : "Mostrar comparación detallada",
              language === 'en' ? "What about pricing comparison?" : "¿Qué hay sobre comparación de precios?",
              language === 'en' ? "I want to see a demo" : "Quiero ver una demo"
            ]
          };
        case 'integration':
          return {
            content: emotionalPrefix + (language === 'en'
              ? "🔗 Excellent question! Statsor integrates seamlessly with your existing workflow:\n\n**Available Integrations:**\n• 📊 **Excel/Google Sheets** - Import/export data\n• 📱 **Mobile Apps** - Sync across devices\n• 🏟️ **Stadium Systems** - Connect to existing infrastructure\n• 📈 **Analytics Platforms** - Export to external tools\n• 🔄 **API Access** - Build custom integrations\n\n**Easy Setup:**\n• 🔌 **Plug & Play** - Most integrations work instantly\n• 📚 **Documentation** - Complete API documentation\n• 🛠️ **Developer Support** - Technical assistance available\n\nWould you like me to show you how to set up any specific integration?"
              : "🔗 ¡Excelente pregunta! Statsor se integra perfectamente con tu flujo de trabajo existente:\n\n**Integraciones Disponibles:**\n• 📊 **Excel/Google Sheets** - Importar/exportar datos\n• 📱 **Apps Móviles** - Sincronizar entre dispositivos\n• 🏟️ **Sistemas de Estadio** - Conectar con infraestructura existente\n• 📈 **Plataformas de Análisis** - Exportar a herramientas externas\n• 🔄 **Acceso API** - Construir integraciones personalizadas\n\n**Configuración Fácil:**\n• 🔌 **Plug & Play** - La mayoría de integraciones funcionan al instante\n• 📚 **Documentación** - Documentación completa de API\n• 🛠️ **Soporte para Desarrolladores** - Asistencia técnica disponible\n\n¿Te gustaría que te muestre cómo configurar alguna integración específica?"),
            suggestions: [
              language === 'en' ? "Show API documentation" : "Mostrar documentación API",
              language === 'en' ? "Help me set up integration" : "Ayúdame a configurar integración",
              language === 'en' ? "What about custom integrations?" : "¿Qué hay sobre integraciones personalizadas?"
            ]
          };
        case 'training':
          return {
            content: emotionalPrefix + (language === 'en'
              ? "📚 I'd love to help you learn Statsor! Here's our comprehensive training program:\n\n**Learning Path:**\n• 🎯 **Quick Start** - Get running in 10 minutes\n• 📊 **Basic Analytics** - Understand your data\n• 🤖 **AI Features** - Master tactical insights\n• 📱 **Mobile Usage** - Optimize for the field\n• 🏆 **Advanced Features** - Unlock full potential\n\n**Training Resources:**\n• 🎥 **Video Tutorials** - Step-by-step guides\n• 📖 **Interactive Guides** - Learn by doing\n• 👥 **Live Training** - Personal sessions available\n• 📚 **Documentation** - Complete reference\n• 🎓 **Certification** - Become a Statsor expert\n\nWhich area would you like to start with?"
              : "📚 ¡Me encantaría ayudarte a aprender Statsor! Aquí está nuestro programa de entrenamiento completo:\n\n**Ruta de Aprendizaje:**\n• 🎯 **Inicio Rápido** - Funcionando en 10 minutos\n• 📊 **Análisis Básico** - Entiende tus datos\n• 🤖 **Funciones de IA** - Domina los insights tácticos\n• 📱 **Uso Móvil** - Optimiza para el campo\n• 🏆 **Funciones Avanzadas** - Desbloquea todo el potencial\n\n**Recursos de Entrenamiento:**\n• 🎥 **Tutoriales en Video** - Guías paso a paso\n• 📖 **Guías Interactivas** - Aprende haciendo\n• 👥 **Entrenamiento en Vivo** - Sesiones personales disponibles\n• 📚 **Documentación** - Referencia completa\n• 🎓 **Certificación** - Conviértete en experto de Statsor\n\n¿Con qué área te gustaría empezar?"),
            suggestions: [
              language === 'en' ? "Start with quick start guide" : "Empezar con guía de inicio rápido",
              language === 'en' ? "Show me video tutorials" : "Muéstrame tutoriales en video",
              language === 'en' ? "I want live training" : "Quiero entrenamiento en vivo"
            ]
          };
      }
    }

    // Enhanced default response with more personality and context awareness
    const defaultResponse = getBotResponse(userMessage);
    return {
      content: emotionalPrefix + defaultResponse.content,
      suggestions: defaultResponse.suggestions
    };
  };

  const handleQuickAction = (action: string) => {
    const actionMap: { [key: string]: string } = {
      [language === 'en' ? "Features" : "Funciones"]: language === 'en' ? "Tell me about all the features" : "Cuéntame sobre todas las funciones",
      [language === 'en' ? "Pricing" : "Precios"]: language === 'en' ? "What are the pricing plans?" : "¿Cuáles son los planes de precios?",
      [language === 'en' ? "Get Demo" : "Obtener Demo"]: language === 'en' ? "I want to see a demo" : "Quiero ver una demo",
      [language === 'en' ? "Support" : "Soporte"]: language === 'en' ? "I need help and support" : "Necesito ayuda y soporte"
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: actionMap[action] || action,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue(actionMap[action] || action);
    handleSendMessage();
  };

  const handleSuggestion = (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring" }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className={`p-3 rounded-full shadow-2xl ${
            isDark 
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
              : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600'
          } text-white relative group`}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle className="h-5 w-5" />
          
          {/* Friendly notification dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full border-2 border-white shadow-sm"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Hover tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {language === 'en' ? 'Chat with us!' : '¡Chatea con nosotros!'}
            <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-50 w-80 h-[500px]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`w-full h-full rounded-2xl shadow-2xl border backdrop-blur-sm ${
              isDark 
                ? 'bg-gray-900/95 border-gray-700' 
                : 'bg-white/95 border-gray-200'
            }`}>
              <motion.div
                className="w-full h-full rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    "0 25px 50px -12px rgba(34, 197, 94, 0.15)",
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
              {/* Header */}
              <div className={`p-3 border-b rounded-t-2xl ${
                isDark 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 border-gray-700' 
                  : 'bg-gradient-to-r from-green-400 to-green-500 border-gray-200'
              } text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <motion.div
                        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-300 rounded-full border border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Statsor Assistant</h3>
                      <p className="text-xs opacity-90 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1.5" />
                        {language === 'en' ? 'Online' : 'En línea'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Quick Actions */}
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className={`text-xs mb-2 font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {language === 'en' ? 'Quick actions:' : 'Acciones rápidas:'}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.label}
                          onClick={() => handleQuickAction(action.label)}
                          className={`p-2 text-xs rounded-lg text-left transition-all bg-gradient-to-r ${action.color} text-white hover:shadow-lg group relative`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-1.5">
                            <action.icon className="h-3 w-3" />
                            <span className="font-medium truncate">{action.label}</span>
                          </div>
                          
                          {/* Enhanced tooltip */}
                          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 ${
                            isDark ? 'bg-gray-800' : 'bg-gray-900'
                          }`}>
                            {action.description}
                            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                              isDark ? 'border-t-gray-800' : 'border-t-gray-900'
                            }`}></div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-3 h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[85%] ${
                            message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === 'user'
                                ? isDark ? 'bg-blue-500' : 'bg-blue-400'
                                : isDark ? 'bg-green-500' : 'bg-green-400'
                            } text-white`}>
                              {message.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                            </div>
                            <div className={`p-2.5 rounded-2xl text-sm ${
                              message.type === 'user'
                                ? isDark ? 'bg-blue-500 text-white' : 'bg-blue-400 text-white'
                                : isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-xs whitespace-pre-line leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.type === 'user' ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="flex items-start space-x-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-green-500' : 'bg-green-400'
                            } text-white`}>
                              <Bot className="h-3 w-3" />
                            </div>
                            <div className={`p-2.5 rounded-2xl ${
                              isDark ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                              <div className="flex space-x-1">
                                <motion.div
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                />
                                <motion.div
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestions */}
                  {messages.length > 0 && messages[messages.length - 1].type === 'bot' && messages[messages.length - 1].suggestions && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-1.5">
                        {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestion(suggestion)}
                            className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                              isDark 
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={language === 'en' ? 'Ask me anything...' : 'Pregúntame lo que sea...'}
                        className={`flex-1 text-sm ${
                          isDark 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className={`p-2 ${
                          isDark ? 'bg-green-500 hover:bg-green-600' : 'bg-green-400 hover:bg-green-500'
                        } text-white`}
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 