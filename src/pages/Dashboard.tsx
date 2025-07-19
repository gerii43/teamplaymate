import React from 'react';
import Layout from '@/components/Layout';
import EnhancedDashboard from '@/components/EnhancedDashboard';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6">
        <EnhancedDashboard />
      </div>
    </Layout>
  );
};

export default Dashboard;