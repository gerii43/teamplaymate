import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Hero } from "@/components/Hero";
import { KeyBenefits } from "@/components/KeyBenefits";
import { Features } from "@/components/Features";
import { FunctionalitiesCarousel } from "@/components/FunctionalitiesCarousel";
import { FormatTypes } from "@/components/FormatTypes";
import { ModalitySection } from "@/components/ModalitySection";
import NewPricingSection from "@/components/NewPricingSection";
import { CTASection } from "@/components/CTASection";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { PersonalizedDemoForm } from "@/components/PersonalizedDemoForm";
import { Footer } from "@/components/Footer";
import { FootballChatbot } from "@/components/FootballChatbot";
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe } from 'lucide-react';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.main 
        className={`min-h-screen transition-colors duration-500 ${
          theme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'bg-white text-gray-900'
        }`}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Theme and Language Toggle */}
        <motion.div 
          className="fixed top-4 right-4 z-50 flex gap-2"
          variants={itemVariants}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className={`rounded-full p-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={`rounded-full p-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </motion.div>

        {/* Hero Section with Enhanced Animation */}
        <motion.div variants={itemVariants}>
          <Hero />
        </motion.div>

        {/* Key Benefits with Stagger Animation */}
        <motion.div variants={itemVariants}>
          <KeyBenefits />
        </motion.div>

        {/* Format Types with Slide Animation */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <FormatTypes />
        </motion.div>

        {/* Features with Scale Animation */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
        >
          <Features />
        </motion.div>

        {/* Functionalities Carousel with Fade Animation */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <FunctionalitiesCarousel />
        </motion.div>

        {/* Modality Section with Slide Up Animation */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ModalitySection />
        </motion.div>

        {/* Pricing Section with Bounce Animation */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 100 
          }}
        >
          <NewPricingSection />
        </motion.div>

        {/* CTA Section with Pulse Animation */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <CTASection />
        </motion.div>

        {/* Enhanced Testimonials with 3D Card Effect */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <TestimonialsCarousel />
        </motion.div>

        {/* Demo Form with Slide Up Animation */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <PersonalizedDemoForm />
        </motion.div>

        {/* Footer with Fade Animation */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Footer />
        </motion.div>

        {/* Floating Chatbot with Bounce Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 2, 
            duration: 0.5, 
            type: "spring", 
            stiffness: 200 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FootballChatbot />
        </motion.div>

        {/* Floating Action Button for Demo */}
        <motion.div
          className="fixed bottom-6 left-6 z-40"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="rounded-full shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3"
          >
            {language === 'en' ? 'Get Demo' : 'Obtener Demo'}
          </Button>
        </motion.div>

        {/* Scroll Progress Indicator */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 z-50"
          style={{
            scaleX: 0,
            transformOrigin: "0%"
          }}
          whileInView={{
            scaleX: 1,
            transition: { duration: 0.5 }
          }}
          viewport={{ once: false }}
        />
      </motion.main>
    </AnimatePresence>
  );
};

export default Index;