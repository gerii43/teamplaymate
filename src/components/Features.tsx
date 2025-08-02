import { motion } from "framer-motion";
import { ClipboardList, Users2, BarChart2, FileText, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export const Features = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: <ClipboardList className="w-10 h-10 text-white" />,
      title: t('features.training.title'),
      description: t('features.training.description'),
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700'
    }, 
    {
      icon: <Users2 className="w-10 h-10 text-white" />,
      title: t('features.attendance.title'),
      description: t('features.attendance.description'),
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'from-green-600 to-green-700'
    }, 
    {
      icon: <BarChart2 className="w-10 h-10 text-white" />,
      title: t('features.stats.title'),
      description: t('features.stats.description'),
      gradient: 'from-yellow-500 to-yellow-600',
      hoverGradient: 'from-yellow-600 to-yellow-700'
    }, 
    {
      icon: <FileText className="w-10 h-10 text-white" />,
      title: t('features.reports.title'),
      description: t('features.reports.description'),
      gradient: 'from-red-500 to-red-600',
      hoverGradient: 'from-red-600 to-red-700'
    }
  ];

  return (
    <section className={`py-24 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('features.title')}
          </motion.h2>
          <motion.p 
            className={`text-lg mt-4 max-w-3xl mx-auto leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('features.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className={`p-8 rounded-2xl border transition-all duration-300 group cursor-pointer ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:shadow-green-500/10' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-2xl'
              }`}
            >
              <motion.div 
                className={`mb-6 w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:bg-gradient-to-r ${feature.hoverGradient} transition-all duration-300`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
              >
                {feature.icon}
              </motion.div>
              
              <h3 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              
              <p className={`leading-relaxed mb-6 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>

              <motion.div
                className={`inline-flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className={`inline-flex items-center gap-4 px-8 py-4 rounded-full border-2 ${
              isDark 
                ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                : 'border-green-500/30 bg-green-50 text-green-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-semibold">Ready to get started?</span>
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};