import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const AdvancedAnalytics = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('sidebar.advanced.analytics')}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">{t('sidebar.advanced.analytics')} - {t('general.in.development')}</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdvancedAnalytics;