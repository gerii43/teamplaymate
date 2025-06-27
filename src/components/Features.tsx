import { motion } from "framer-motion";
import { ClipboardList, Users2, BarChart2, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Features = () => {
  const { t } = useLanguage();

  const features = [{
    icon: <ClipboardList className="w-10 h-10 text-blue-100 p-2 bg-blue-500 rounded-lg" />,
    title: t('features.training.title'),
    description: t('features.training.description')
  }, {
    icon: <Users2 className="w-10 h-10 text-green-100 p-2 bg-green-500 rounded-lg" />,
    title: t('features.attendance.title'),
    description: t('features.attendance.description')
  }, {
    icon: <BarChart2 className="w-10 h-10 text-yellow-100 p-2 bg-yellow-500 rounded-lg" />,
    title: t('features.stats.title'),
    description: t('features.stats.description')
  }, {
    icon: <FileText className="w-10 h-10 text-red-100 p-2 bg-red-500 rounded-lg" />,
    title: t('features.reports.title'),
    description: t('features.reports.description')
  }];

  return <section className="py-24 bg-gray-50">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mt-2">{t('features.title')}</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} viewport={{
          once: true
        }} className="p-6 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-secondary">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};