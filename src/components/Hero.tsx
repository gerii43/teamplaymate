import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { InteractiveDemo } from "./InteractiveDemo";
import { Button } from "@/components/ui/button";

import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Play, Star, Globe, Moon, Sun } from "lucide-react";
import { HumanizedHelperBot } from "./HumanizedHelperBot";

export const Hero = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const isDark = theme === 'dark';

  return (
    <section className={`relative overflow-hidden pb-24 pt-10 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDark ? 'bg-green-400/20' : 'bg-blue-400/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
            isDark ? 'bg-green-500/10' : 'bg-blue-500/10'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div
          className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-purple-500/10' : 'bg-green-500/10'
          }`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        className={`p-4 border-b ${
          isDark 
            ? 'border-gray-800 bg-black/90 backdrop-blur-sm' 
            : 'border-gray-100 bg-white/90 backdrop-blur-sm'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            {/* Old Statsor Logo */}
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-gradient-to-r from-green-500 to-blue-600' : 'bg-gradient-to-r from-green-600 to-blue-700'
              } text-white font-bold text-xl shadow-lg`}>
                S
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Statsor
              </span>
            </div>
          </motion.div>
          
          <div className="hidden md:flex gap-8 items-center">
            {[
              { href: "/", label: t('nav.home') },
              { href: "/pricing", label: t('nav.pricing') },
              { href: "#demo", label: t('nav.demo') },
              { href: "/blog", label: t('blog.title') },
              { href: "#contacto", label: t('nav.contact') }
            ].map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={`hover:text-primary transition-colors font-medium ${
                  isDark ? 'text-gray-300 hover:text-green-400' : 'text-gray-700'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.a>
            ))}
            
            {user ? (
              <Link to="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    {t('nav.dashboard')}
                  </Button>
                </motion.div>
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link to="/signin">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className={`border-primary text-primary hover:bg-primary hover:text-white ${
                        isDark ? 'border-green-400 text-green-400 hover:bg-green-400' : ''
                      }`}
                    >
                      {t('nav.signin')}
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            {!user && (
              <Link to="/signin">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  {t('nav.signin')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.nav>
      
      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-24 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
              borderColor: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.3)'
            }}
          >
            <Sparkles className="h-4 w-4 text-green-500" />
            <span className={`text-sm font-medium ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`}>
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className={`text-5xl md:text-7xl font-bold mb-8 max-w-5xl mx-auto leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t('hero.title.digitize')}
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {t('hero.title.highlight')}
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {t('hero.subtitle')}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  {t('cta.button')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            
            <Link to="/pricing">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className={`border-2 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400' 
                      : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {t('nav.pricing')}
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Section - Updated with Language/Theme Toggles */}
          <motion.div
            className="flex justify-center gap-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { number: '10K+', label: t('hero.stats.coaches') },
              { number: '50K+', label: t('hero.stats.matches') },
              { number: '99%', label: t('hero.stats.satisfaction') }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  {stat.number}
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Interactive Demo */}
          <motion.div
            className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl mt-12 border"
            id="demo"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            whileHover={{ y: -5 }}
            style={{
              borderColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              boxShadow: isDark 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' 
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <InteractiveDemo />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 right-10 hidden lg:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className={`w-20 h-20 rounded-full ${
          isDark ? 'bg-green-500/20' : 'bg-blue-500/20'
        } flex items-center justify-center`}>
          <Star className="h-8 w-8 text-green-500" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-10 hidden lg:block"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div className={`w-16 h-16 rounded-full ${
          isDark ? 'bg-purple-500/20' : 'bg-green-500/20'
        } flex items-center justify-center`}>
          <Sparkles className="h-6 w-6 text-purple-500" />
        </div>
      </motion.div>

      {/* Humanized Helper Bot */}
      <HumanizedHelperBot />
    </section>
  );
};