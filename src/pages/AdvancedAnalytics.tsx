import React from 'react';
import Layout from '@/components/Layout';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useLanguage } from '@/contexts/LanguageContext';

const AdvancedAnalytics = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="p-6">
        <AnalyticsDashboard />
      </div>
    </Layout>
  );
};

export default AdvancedAnalytics;