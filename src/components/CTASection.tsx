import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";

export const CTASection = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`py-20 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-r from-green-50 via-blue-50 to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-green-400/30' : 'bg-blue-400/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className={`absolute top-10 left-20 w-64 h-64 rounded-full blur-3xl ${
            isDark ? 'bg-green-500/10' : 'bg-green-500/20'
          }`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />
        <motion.div
          className={`absolute bottom-10 right-20 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'
          }`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </motion.div>

      <div className="container px-4 mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
              borderColor: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.3)'
            }}
          >
            <Zap className="h-4 w-4 text-green-500" />
            <span className={`text-sm font-medium ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`}>
              {t('cta.badge')}
            </span>
          </motion.div>

          <motion.h2 
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {t('cta.title')}
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
              {t('cta.highlight')}
            </motion.span>
          </motion.h2>

          <motion.p 
            className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {t('cta.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                {t('cta.button')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className={`border-2 px-10 py-4 text-lg font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400 hover:bg-green-400/10' 
                    : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Play className="mr-2 h-5 w-5" />
                {t('cta.secondary')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Features List */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            viewport={{ once: true }}
          >
            {[
              { icon: <Star className="h-6 w-6" />, text: t('cta.feature1') },
              { icon: <Sparkles className="h-6 w-6" />, text: t('cta.feature2') },
              { icon: <Zap className="h-6 w-6" />, text: t('cta.feature3') }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  isDark 
                    ? 'bg-gray-800/50 border border-gray-700' 
                    : 'bg-white/50 border border-gray-200'
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                }`}>
                  {feature.icon}
                </div>
                <span className={`font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 right-10 hidden lg:block"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className={`w-16 h-16 rounded-full ${
          isDark ? 'bg-green-500/20' : 'bg-blue-500/20'
        } flex items-center justify-center`}>
          <Star className="h-8 w-8 text-green-500" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-10 hidden lg:block"
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div className={`w-12 h-12 rounded-full ${
          isDark ? 'bg-blue-500/20' : 'bg-green-500/20'
        } flex items-center justify-center`}>
          <Sparkles className="h-6 w-6 text-blue-500" />
        </div>
      </motion.div>
    </section>
  );
};