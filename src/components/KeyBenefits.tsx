import { motion } from "framer-motion";
import { Tablet, Wifi, BarChart3, FileSpreadsheet } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const KeyBenefits = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: <Tablet className="w-12 h-12 text-blue-600" />,
      title: t('benefits.tactile.title'),
      description: t('benefits.tactile.description')
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-green-600" />,
      title: t('benefits.analysis.title'),
      description: t('benefits.analysis.description')
    },
    {
      icon: <Wifi className="w-12 h-12 text-purple-600" />,
      title: t('benefits.offline.title'),
      description: t('benefits.offline.description')
    },
    {
      icon: <FileSpreadsheet className="w-12 h-12 text-orange-600" />,
      title: t('benefits.reports.title'),
      description: t('benefits.reports.description')
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{t('benefits.title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('benefits.subtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};