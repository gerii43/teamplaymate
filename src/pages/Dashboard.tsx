import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { InteractiveDemo } from '@/components/InteractiveDemo';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/01b5bf86-f2e7-42cd-9465-4d0bb347d2ea.png" 
                alt="Statsor" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Statsor</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="text-sm text-gray-700">
                {user?.email}
              </span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('dashboard.welcome')}
            </h1>
            <p className="mt-2 text-gray-600">
              {t('dashboard.overview')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <InteractiveDemo />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('dashboard.players')}
              </h3>
              <p className="text-3xl font-bold text-primary">23</p>
              <p className="text-sm text-gray-500">Active players</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('dashboard.matches')}
              </h3>
              <p className="text-3xl font-bold text-primary">12</p>
              <p className="text-sm text-gray-500">This season</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('dashboard.statistics')}
              </h3>
              <p className="text-3xl font-bold text-primary">89%</p>
              <p className="text-sm text-gray-500">Win rate</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('dashboard.attendance')}
              </h3>
              <p className="text-3xl font-bold text-primary">95%</p>
              <p className="text-sm text-gray-500">Average attendance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;