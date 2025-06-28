import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.pricing': 'Precios',
    'nav.demo': 'Demo',
    'nav.contact': 'Contacto',
    'nav.signin': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.dashboard': 'Panel',
    'nav.logout': 'Cerrar Sesión',
    
    // Auth
    'auth.signin.title': 'Iniciar Sesión',
    'auth.signin.subtitle': 'Accede a tu cuenta de Statsor',
    'auth.signup.title': 'Crear Cuenta',
    'auth.signup.subtitle': 'Únete a Statsor y revoluciona tu análisis de fútbol',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.signin.button': 'Iniciar Sesión',
    'auth.signup.button': 'Crear Cuenta',
    'auth.google.button': 'Continuar con Google',
    'auth.forgot.password': '¿Olvidaste tu contraseña?',
    'auth.no.account': '¿No tienes cuenta?',
    'auth.have.account': '¿Ya tienes cuenta?',
    'auth.signup.link': 'Regístrate aquí',
    'auth.signin.link': 'Inicia sesión aquí',
    
    // Hero Section
    'hero.title': 'Digitaliza y analiza el rendimiento de tu equipo de futbol en tiempo real',
    'hero.subtitle': 'Sin necesidad de Wi-Fi. Statsor revoluciona la gestión táctica y el análisis estadístico, dando a los entrenadores el control total para optimizar cada jugada y entrenamiento.',
    'hero.cta': 'Solicita tu demo',
    
    // Key Benefits
    'benefits.title': '¿Por qué elegir Statsor?',
    'benefits.subtitle': 'La herramienta que los entrenadores necesitan para llevar su equipo al siguiente nivel',
    'benefits.tactile.title': 'Registro táctil intuitivo',
    'benefits.tactile.description': 'Registra jugadas, faltas y estadísticas directamente desde tu tablet durante el partido',
    'benefits.analysis.title': 'Análisis individual instantáneo',
    'benefits.analysis.description': 'Métricas detalladas por jugador en tiempo real para optimizar rotaciones y estrategias',
    'benefits.offline.title': 'Funciona sin Wi-Fi',
    'benefits.offline.description': 'Registra y analiza datos offline, sincroniza cuando tengas conexión disponible',
    'benefits.reports.title': 'Informes automáticos',
    'benefits.reports.description': 'Genera reportes profesionales para compartir con jugadores, padres y directivos',
    
    // Features
    'features.title': 'Funciones',
    'features.subtitle': 'Herramientas diseñadas específicamente para entrenadores que buscan mejorar el rendimiento de tu equipo',
    'features.training.title': 'Carga de entrenamientos',
    'features.training.description': 'Planifica y programa tus sesiones con plantillas personalizables. Organiza ejercicios y gestiona cargas de trabajo.',
    'features.attendance.title': 'Control de asistencia',
    'features.attendance.description': 'Seguimiento automático de la participación de jugadores. Identifica patrones y mantén récords de presencia en entrenamientos.',
    'features.stats.title': 'Estadísticas por jugador',
    'features.stats.description': 'Análisis detallado del rendimiento individual. Métricas específicas para cada posición y evolución a lo largo del tiempo.',
    'features.reports.title': 'Informes automáticos',
    'features.reports.description': 'Genera reportes completos sobre el equipo y jugadores. Comparte documentos profesionales con directivos o padres.',
    
    // Pricing
    'pricing.title': 'Escoje tu plan',
    'pricing.subtitle': 'Desbloquee funciones premium para aumentar la productividad y agilizar su flujo de trabajo. Elige el plan que más te convenga.',
    'pricing.monthly': 'Facturación Mensual',
    'pricing.annual': 'Facturación Anual',
    'pricing.save': 'Ahorras hasta 60€!',
    'pricing.starter.title': 'STARTER',
    'pricing.starter.price': '€0',
    'pricing.starter.period': 'por mes',
    'pricing.pro.title': 'PRO',
    'pricing.pro.period': 'por mes',
    'pricing.club.title': 'CLUB',
    'pricing.club.price': 'Desde €250',
    'pricing.club.period': 'por mes',
    
    // CTA Section
    'cta.title': '¿Listo para revolucionar tu análisis de fútbol?',
    'cta.subtitle': 'Únete a miles de entrenadores y analistas que ya están usando nuestra plataforma',
    'cta.button': 'Comenzar ahora',
    
    // Footer
    'footer.product': 'Producto',
    'footer.resources': 'Recursos',
    'footer.company': 'Empresa',
    'footer.rights': '© 2025 Statsor. Todos los derechos reservados.',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',

    // Dashboard
    'dashboard.welcome': 'Bienvenido a Statsor',
    'dashboard.overview': 'Resumen del equipo',
    'dashboard.players': 'Jugadores',
    'dashboard.matches': 'Partidos',
    'dashboard.statistics': 'Estadísticas',
    'dashboard.attendance': 'Asistencia',
    'dashboard.reports': 'Informes',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.pricing': 'Pricing',
    'nav.demo': 'Demo',
    'nav.contact': 'Contact',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    
    // Auth
    'auth.signin.title': 'Sign In',
    'auth.signin.subtitle': 'Access your Statsor account',
    'auth.signup.title': 'Create Account',
    'auth.signup.subtitle': 'Join Statsor and revolutionize your football analysis',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.signin.button': 'Sign In',
    'auth.signup.button': 'Create Account',
    'auth.google.button': 'Continue with Google',
    'auth.forgot.password': 'Forgot your password?',
    'auth.no.account': "Don't have an account?",
    'auth.have.account': 'Already have an account?',
    'auth.signup.link': 'Sign up here',
    'auth.signin.link': 'Sign in here',
    
    // Hero Section
    'hero.title': 'Digitize and analyze your football team\'s performance in real time',
    'hero.subtitle': 'No Wi-Fi needed. Statsor revolutionizes tactical management and statistical analysis, giving coaches total control to optimize every play and training session.',
    'hero.cta': 'Request your demo',
    
    // Key Benefits
    'benefits.title': 'Why choose Statsor?',
    'benefits.subtitle': 'The tool coaches need to take their team to the next level',
    'benefits.tactile.title': 'Intuitive touch recording',
    'benefits.tactile.description': 'Record plays, fouls and statistics directly from your tablet during the match',
    'benefits.analysis.title': 'Instant individual analysis',
    'benefits.analysis.description': 'Detailed player metrics in real time to optimize rotations and strategies',
    'benefits.offline.title': 'Works without Wi-Fi',
    'benefits.offline.description': 'Record and analyze data offline, sync when you have connection available',
    'benefits.reports.title': 'Automatic reports',
    'benefits.reports.description': 'Generate professional reports to share with players, parents and management',
    
    // Features
    'features.title': 'Features',
    'features.subtitle': 'Tools designed specifically for coaches looking to improve your team\'s performance',
    'features.training.title': 'Training load',
    'features.training.description': 'Plan and schedule your sessions with customizable templates. Organize exercises and manage workloads.',
    'features.attendance.title': 'Attendance control',
    'features.attendance.description': 'Automatic tracking of player participation. Identify patterns and maintain training attendance records.',
    'features.stats.title': 'Player statistics',
    'features.stats.description': 'Detailed analysis of individual performance. Position-specific metrics and evolution over time.',
    'features.reports.title': 'Automatic reports',
    'features.reports.description': 'Generate comprehensive reports on team and players. Share professional documents with management or parents.',
    
    // Pricing
    'pricing.title': 'Choose your plan',
    'pricing.subtitle': 'Unlock premium features to boost productivity and streamline your workflow. Choose the plan that suits you best.',
    'pricing.monthly': 'Monthly Billing',
    'pricing.annual': 'Annual Billing',
    'pricing.save': 'Save up to €60!',
    'pricing.starter.title': 'STARTER',
    'pricing.starter.price': '€0',
    'pricing.starter.period': 'per month',
    'pricing.pro.title': 'PRO',
    'pricing.pro.period': 'per month',
    'pricing.club.title': 'CLUB',
    'pricing.club.price': 'From €250',
    'pricing.club.period': 'per month',
    
    // CTA Section
    'cta.title': 'Ready to revolutionize your football analysis?',
    'cta.subtitle': 'Join thousands of coaches and analysts who are already using our platform',
    'cta.button': 'Get started now',
    
    // Footer
    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
    'footer.rights': '© 2025 Statsor. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',

    // Dashboard
    'dashboard.welcome': 'Welcome to Statsor',
    'dashboard.overview': 'Team Overview',
    'dashboard.players': 'Players',
    'dashboard.matches': 'Matches',
    'dashboard.statistics': 'Statistics',
    'dashboard.attendance': 'Attendance',
    'dashboard.reports': 'Reports',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};