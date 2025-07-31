import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, TrendingUp } from 'lucide-react';

export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-green-50 via-blue-50 to-white'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [180, 360, 180],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className={`${
              theme === 'dark' 
                ? 'text-white' 
                : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Ready to revolutionize' : '¿Listo para revolucionar'}
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {language === 'en' ? 'your football analysis?' : 'tu análisis de fútbol?'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed ${
              theme === 'dark' 
                ? 'text-gray-300' 
                : 'text-gray-600'
            }`}
          >
            {language === 'en' 
              ? "Join thousands of coaches and analysts who are already using our platform to transform their team's performance with real-time data and AI-powered insights."
              : "Únete a miles de entrenadores y analistas que ya están usando nuestra plataforma para transformar el rendimiento de su equipo con datos en tiempo real e insights impulsados por IA."
            }
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg"
              >
                {language === 'en' ? 'Start Now' : 'Comenzar ahora'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className={`border-2 px-8 py-4 text-lg rounded-full font-semibold ${
                  theme === 'dark'
                    ? 'border-gray-600 text-white hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Play className="mr-2 w-5 h-5" />
                {language === 'en' ? 'Watch Demo' : 'Ver Demo'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Users,
                number: "10,000+",
                label: language === 'en' ? "Active Coaches" : "Entrenadores Activos"
              },
              {
                icon: Star,
                number: "4.9/5",
                label: language === 'en' ? "User Rating" : "Valoración"
              },
              {
                icon: TrendingUp,
                number: "40%",
                label: language === 'en' ? "Performance Boost" : "Mejora Rendimiento"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-green-400'
                      : 'bg-white text-green-600 shadow-lg'
                  }`}
                  variants={floatingVariants}
                  animate="animate"
                >
                  <stat.icon className="w-8 h-8" />
                </motion.div>
                <motion.div
                  className={`text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-16"
          >
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {language === 'en' ? 'Trusted by leading clubs worldwide' : 'Confiado por clubes líderes en todo el mundo'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Valencia CF', 'Real Atlético', 'Barcelona Youth', 'Madrid United'].map((club, index) => (
                <motion.div
                  key={index}
                  className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {club}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={`w-6 h-10 border-2 rounded-full flex justify-center ${
          theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
        }`}>
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};