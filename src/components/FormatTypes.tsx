import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const FormatTypes = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4 text-center">{t('format.future.title')}</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="border-l-4 border-green-600 pl-6">
              <blockquote className="text-2xl text-gray-900 mb-4 rounded-none leading-relaxed">
                {t('format.wenger.quote')}
              </blockquote>
              <cite className="text-xl text-gray-600 font-semibold">{t('format.wenger.author')}</cite>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <img
                alt="Ilustración isométrica 3D de análisis de datos de fútbol con tablet, gráficos y estadísticas"
                className="w-full max-w-lg h-auto"
                src="/lovable-uploads/ad01409c-b56f-456f-8574-f9346b3e3d81.jpg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};