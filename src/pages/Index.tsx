import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe, ChevronDown, Star, Users, BarChart3, Wifi, FileText, ArrowRight, Play, Zap, Shield, Target, X, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HumanizedHelperBot } from '@/components/HumanizedHelperBot';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  // Enhanced animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.main 
        className={`min-h-screen transition-all duration-700 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' 
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900'
        }`}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 z-50"
          style={{
            scaleX: scrollYProgress,
            transformOrigin: "0%"
          }}
        />

        {/* Enhanced Theme and Language Toggle */}
        <motion.div 
          className="fixed top-6 right-6 z-50 flex gap-3"
          variants={itemVariants}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className={`rounded-full p-3 backdrop-blur-md border-2 transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-black/20 border-gray-600 text-white hover:bg-gray-800/50 hover:border-gray-500' 
                : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
            }`}
          >
            <Globe className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={`rounded-full p-3 backdrop-blur-md border-2 transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-black/20 border-gray-600 text-white hover:bg-gray-800/50 hover:border-gray-500' 
                : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </motion.div>

        {/* Enhanced Navigation */}
        <motion.nav 
          className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-500 ${
            theme === 'dark' 
              ? 'bg-black/20 border-gray-800' 
              : 'bg-white/80 border-gray-200'
          }`}
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                  theme === 'dark' 
                    ? 'from-green-500 to-green-600 shadow-lg shadow-green-500/25' 
                    : 'from-green-400 to-green-500 shadow-lg shadow-green-400/25'
                }`}>
                  <div className="relative">
                    <Target className="h-7 w-7 text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    Statsor
                  </span>
                  <span className="text-xs opacity-70 -mt-1">
                    {language === 'en' ? 'Football Analytics' : 'Análisis de Fútbol'}
                  </span>
                </div>
              </motion.div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="hover:text-green-500 transition-colors font-medium">
                  {language === 'en' ? 'Home' : 'Inicio'}
                </Link>
                <a href="#features" className="hover:text-green-500 transition-colors font-medium">
                  {language === 'en' ? 'Features' : 'Funciones'}
                </a>
                <Link to="/pricing" className="hover:text-green-500 transition-colors font-medium">
                  {language === 'en' ? 'Pricing' : 'Precios'}
                </Link>
                <a href="#demo" className="hover:text-green-500 transition-colors font-medium">
                  {language === 'en' ? 'Demo' : 'Demo'}
                </a>
                <a href="#contact" className="hover:text-green-500 transition-colors font-medium">
                  {language === 'en' ? 'Contact' : 'Contacto'}
                </a>
                <Link to="/signin">
                  <Button variant="outline" className="border-2">
                    {language === 'en' ? 'Sign In' : 'Iniciar Sesión'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Enhanced Hero Section */}
        <motion.section 
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          variants={heroVariants}
        >
          {/* Animated Background Elements */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              background: [
                'radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
              variants={itemVariants}
            >
              {language === 'en' ? (
                <>
                  Ready to revolutionize
                  <br />
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    your football analysis?
                  </span>
                </>
              ) : (
                <>
                  ¿Listo para revolucionar
                  <br />
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    tu análisis de fútbol?
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-80"
              variants={itemVariants}
            >
              {language === 'en' 
                ? 'Join thousands of coaches and analysts who are already using our platform'
                : 'Únete a miles de entrenadores y analistas que ya están usando nuestra plataforma'
              }
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              variants={itemVariants}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup">
                  <Button 
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
                  >
                    {language === 'en' ? 'Get Started' : 'Comenzar'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowDemo(true)}
                  className="border-2 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-green-500 hover:text-white hover:border-green-500"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {language === 'en' ? 'Watch Demo' : 'Ver Demo'}
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div 
              className="flex justify-center space-x-8 mb-16"
              variants={itemVariants}
            >
              {[
                { number: '10K+', label: language === 'en' ? 'Coaches' : 'Entrenadores' },
                { number: '50K+', label: language === 'en' ? 'Matches' : 'Partidos' },
                { number: '99%', label: language === 'en' ? 'Satisfaction' : 'Satisfacción' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={floatingVariants}
                  animate="animate"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className="text-3xl font-bold text-green-500">{stat.number}</div>
                  <div className="text-sm opacity-70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-8 w-8 opacity-50" />
          </motion.div>
        </motion.section>

        {/* Enhanced Features Section */}
        <motion.section 
          id="features"
          className="py-24"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {language === 'en' ? 'Functions' : 'Funciones'}
              </h2>
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                {language === 'en' 
                  ? 'Tools specifically designed for coaches looking to improve their team\'s performance'
                  : 'Herramientas diseñadas específicamente para entrenadores que buscan mejorar el rendimiento de tu equipo'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: language === 'en' ? 'Training Upload' : 'Carga de entrenamientos',
                  description: language === 'en' 
                    ? 'Plan and schedule your sessions with customizable templates. Organize exercises and manage workloads.'
                    : 'Planifica y programa tus sesiones con plantillas personalizables. Organiza ejercicios y gestiona cargas de trabajo.',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: BarChart3,
                  title: language === 'en' ? 'Attendance Control' : 'Control de asistencia',
                  description: language === 'en'
                    ? 'Automatic tracking of player participation. Identify patterns and maintain attendance records.'
                    : 'Seguimiento automático de la participación de jugadores. Identifica patrones y mantén récords de presencia.',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: Target,
                  title: language === 'en' ? 'Player Statistics' : 'Estadísticas por jugador',
                  description: language === 'en'
                    ? 'Detailed analysis of individual performance. Specific metrics for each position and evolution over time.'
                    : 'Análisis detallado del rendimiento individual. Métricas específicas para cada posición y evolución a lo largo del tiempo.',
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  icon: FileText,
                  title: language === 'en' ? 'Automatic Reports' : 'Informes automáticos',
                  description: language === 'en'
                    ? 'Generate complete reports on the team and players. Share professional documents with directors or parents.'
                    : 'Genera reportes completos sobre el equipo y jugadores. Comparte documentos profesionales con directivos o padres.',
                  color: 'from-red-500 to-red-600'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                      : 'bg-white/80 border-gray-200 hover:border-gray-300'
                  }`}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="opacity-80 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Enhanced Modality Section */}
        <motion.section 
          className="py-24"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {language === 'en' ? 'Adapted to your modality' : 'Adaptado a tu modalidad'}
              </h2>
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                {language === 'en'
                  ? 'Statsor adapts perfectly to both soccer 11 and futsal, with specific functionalities for each modality.'
                  : 'Statsor se adapta perfectamente tanto a fútbol 11 como a futsal, con funcionalidades específicas para cada modalidad.'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Soccer 11 */}
              <motion.div
                className="p-8 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-bold mb-6">Fútbol 11</h3>
                <ul className="space-y-4">
                  {[
                    language === 'en' ? 'Extensive squad management (up to 25 players)' : 'Gestión de plantillas amplias (hasta 25 jugadores)',
                    language === 'en' ? 'Tactical analysis for 11vs11 formations' : 'Análisis táctico para formaciones 11vs11',
                    language === 'en' ? 'Specific position tracking' : 'Seguimiento de posiciones específicas',
                    language === 'en' ? 'Full match statistics (90 min)' : 'Estadísticas de partidos completos (90 min)',
                    language === 'en' ? 'Complete season planning' : 'Planificación de temporada completa'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Futsal */}
              <motion.div
                className="p-8 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-bold mb-6">Futsal</h3>
                <ul className="space-y-4">
                  {[
                    language === 'en' ? 'Intensive rotation control' : 'Control de rotaciones intensivas',
                    language === 'en' ? 'Small space game analysis' : 'Análisis de juego en espacio reducido',
                    language === 'en' ? 'Intensity and rhythm metrics' : 'Métricas de intensidad y ritmo',
                    language === 'en' ? 'Match statistics (40 min)' : 'Estadísticas de partidos (40 min)',
                    language === 'en' ? 'Double competition management' : 'Gestión de dobles competiciones'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Testimonials Section */}
        <motion.section 
          className="py-24"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {language === 'en' ? 'Testimonials' : 'Testimonios'}
              </h2>
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                {language === 'en'
                  ? 'Discover how coaches of all levels have improved with Statsor'
                  : 'Descubre cómo entrenadores de todos los niveles han mejorado con Statsor'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Luisa Sanz',
                  role: language === 'en' ? 'Aguilas Women\'s | Coach' : 'Águilas Femenino | Entrenadora',
                  quote: language === 'en'
                    ? 'What I like most about Statsor is its ease of use. I can access it from any device, even from the field, and have all my team\'s information just a click away.'
                    : 'Lo que más me gusta de Statsor es la facilidad de uso. Puedo acceder desde cualquier dispositivo, incluso desde el campo, y tener toda la información de mi equipo a un clic de distancia.',
                  avatar: 'LS',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  name: 'Carlos Rodríguez',
                  role: language === 'en' ? 'Unión CF | Physical Trainer' : 'Unión CF | Preparador Físico',
                  quote: language === 'en'
                    ? 'As a physical trainer, the statistics and workload management in Statsor are unbeatable. We have reduced injuries by 30% thanks to personalized training.'
                    : 'Como preparador físico, las estadísticas y la gestión de carga de trabajo en Statsor son insuperables. Hemos reducido lesiones en un 30% gracias a los entrenamientos personalizados.',
                  avatar: 'CR',
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  name: 'Ana Martínez',
                  role: language === 'en' ? 'Barcelona Women\'s | Analyst' : 'Barcelona Femení | Analista',
                  quote: language === 'en'
                    ? 'The platform has allowed us to significantly improve our tactical decisions. The detailed reports are incredibly useful for post-match analysis.'
                    : 'La plataforma nos ha permitido mejorar significativamente nuestras decisiones tácticas. Los informes detallados son increíblemente útiles para el análisis post-partido.',
                  avatar: 'AM',
                  color: 'from-blue-500 to-blue-600'
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                      : 'bg-white/80 border-gray-200 hover:border-gray-300'
                  }`}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center mr-4`}>
                      <span className="text-white font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm opacity-70">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="opacity-80 leading-relaxed mb-4">"{testimonial.quote}"</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Enhanced CTA Section */}
        <motion.section 
          className="py-24"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              className="text-center"
              variants={pulseVariants}
              animate="animate"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                {language === 'en' ? 'The future of football is NOW' : 'El futuro del fútbol es AHORA'}
              </h2>
              <p className="text-xl opacity-80 max-w-3xl mx-auto mb-12">
                {language === 'en'
                  ? 'We live in a world where data is very important, and the next step will be to use artificial intelligence to anticipate decision-making and the potential of players.'
                  : 'Vivimos en un mundo donde los datos son muy importantes, y el siguiente paso será usar la inteligencia artificial para anticipar la toma de decisiones y el potencial de los jugadores.'
                }
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-xl font-semibold text-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
                >
                  {language === 'en' ? 'Request Your Demo' : 'Solicita tu demo'}
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Humanized Helper Bot */}
        <HumanizedHelperBot />

        {/* Enhanced Footer */}
        <motion.footer 
          className={`py-16 border-t transition-all duration-500 ${
            theme === 'dark' 
              ? 'bg-black/20 border-gray-800' 
              : 'bg-white/80 border-gray-200'
          }`}
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    theme === 'dark' ? 'bg-green-600' : 'bg-green-500'
                  }`}>
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Statsor</span>
                </div>
                <p className="opacity-80">
                  {language === 'en'
                    ? 'Integral software for football coaches that revolutionizes team management'
                    : 'Software integral para entrenadores de fútbol que revoluciona la gestión de equipos'
                  }
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">{language === 'en' ? 'Product' : 'Producto'}</h4>
                <ul className="space-y-2 opacity-80">
                  <li><Link to="/" className="hover:text-green-500 transition-colors">{language === 'en' ? 'Home' : 'Inicio'}</Link></li>
                  <li><a href="#features" className="hover:text-green-500 transition-colors">{language === 'en' ? 'Features' : 'Funciones'}</a></li>
                  <li><Link to="/pricing" className="hover:text-green-500 transition-colors">{language === 'en' ? 'Pricing' : 'Precios'}</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">{language === 'en' ? 'Resources' : 'Recursos'}</h4>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-green-500 transition-colors">{language === 'en' ? 'Documentation' : 'Documentación'}</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">{language === 'en' ? 'API' : 'API'}</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">{language === 'en' ? 'Support' : 'Soporte'}</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">{language === 'en' ? 'Company' : 'Empresa'}</h4>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-green-500 transition-colors">{language === 'en' ? 'About Us' : 'Sobre Nosotros'}</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">{language === 'en' ? 'Contact' : 'Contacto'}</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">{language === 'en' ? 'Privacy' : 'Privacidad'}</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-8 text-center opacity-60">
              <p>&copy; 2024 Statsor. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
            </div>
          </div>
        </motion.footer>

        {/* Powerful Demo Modal */}
        <AnimatePresence>
          {showDemo && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDemo(false)}
              />
              
              {/* Modal Content */}
              <motion.div
                className={`relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                } shadow-2xl`}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {/* Header */}
                <div className={`p-6 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          {language === 'en' ? 'Statsor Demo' : 'Demo de Statsor'}
                        </h2>
                        <p className="text-sm opacity-70">
                          {language === 'en' ? 'See how Statsor transforms football coaching' : 'Ve cómo Statsor transforma el entrenamiento de fútbol'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDemo(false)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative bg-black">
                  <div className="aspect-video relative">
                    {/* Placeholder for video - you can replace with actual video */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-4 mx-auto">
                          <Play className="h-12 w-12 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {language === 'en' ? 'Interactive Demo Coming Soon' : 'Demo Interactiva Próximamente'}
                        </h3>
                        <p className="text-gray-400 max-w-md">
                          {language === 'en' 
                            ? 'Experience the full power of Statsor with our interactive demo. See real-time analytics, player tracking, and AI insights in action.'
                            : 'Experimenta todo el poder de Statsor con nuestra demo interactiva. Ve análisis en tiempo real, seguimiento de jugadores e insights de IA en acción.'
                          }
                        </p>
                      </div>
                    </div>
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="bg-black/50 hover:bg-black/70 text-white"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                          className="bg-black/50 hover:bg-black/70 text-white"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="bg-black/50 hover:bg-black/70 text-white"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Demo Features */}
                <div className={`p-6 ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                }`}>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                        <BarChart3 className="h-6 w-6 text-blue-500" />
                      </div>
                      <h4 className="font-semibold mb-2">
                        {language === 'en' ? 'Real-time Analytics' : 'Analíticas en Tiempo Real'}
                      </h4>
                      <p className="text-sm opacity-70">
                        {language === 'en' 
                          ? 'Live match statistics and performance insights'
                          : 'Estadísticas de partido en vivo e insights de rendimiento'
                        }
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-green-500" />
                      </div>
                      <h4 className="font-semibold mb-2">
                        {language === 'en' ? 'Player Tracking' : 'Seguimiento de Jugadores'}
                      </h4>
                      <p className="text-sm opacity-70">
                        {language === 'en' 
                          ? 'Individual performance monitoring and analysis'
                          : 'Monitoreo y análisis del rendimiento individual'
                        }
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                        <Zap className="h-6 w-6 text-purple-500" />
                      </div>
                      <h4 className="font-semibold mb-2">
                        {language === 'en' ? 'AI Insights' : 'Insights de IA'}
                      </h4>
                      <p className="text-sm opacity-70">
                        {language === 'en' 
                          ? 'Smart tactical recommendations and predictions'
                          : 'Recomendaciones tácticas inteligentes y predicciones'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex justify-center space-x-4 mt-8">
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white px-8"
                      onClick={() => setShowDemo(false)}
                    >
                      {language === 'en' ? 'Start Free Trial' : 'Comenzar Prueba Gratuita'}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8"
                      onClick={() => setShowDemo(false)}
                    >
                      {language === 'en' ? 'Schedule Demo' : 'Programar Demo'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </AnimatePresence>
  );
};

export default Index;