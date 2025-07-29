import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Force immediate re-render
    window.dispatchEvent(new Event('languageChanged'));
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'es' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('es')}
        className="text-xs px-3 py-1"
      >
        ES
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('en')}
        className="text-xs px-3 py-1"
      >
        EN
      </Button>
    </div>
  );
};