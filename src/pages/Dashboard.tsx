import React from 'react';
import Layout from '@/components/Layout';
import EnhancedDashboard from '@/components/EnhancedDashboard';
import { useLanguage } from '@/contexts/LanguageContext';
const Dashboard = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.home')}</h1>
        </div>
        <EnhancedDashboard />
      </div>
    </Layout>
  );
};

export default Dashboard;