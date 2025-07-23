import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const TacticalChat = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('sidebar.tactical.chat')}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">{t('sidebar.tactical.chat')} - {t('general.in.development')}</p>
        </div>
      </div>
    </Layout>
  );
};

export default TacticalChat;