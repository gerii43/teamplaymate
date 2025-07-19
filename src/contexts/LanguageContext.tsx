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
    'hero.title': 'Digitaliza y analiza el rendimiento de tu equipo de fútbol en tiempo real',
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
    
    // Format Types
    'format.future.title': 'El futuro del fútbol es AHORA',
    'format.wenger.quote': '"Vivimos en un mundo donde los datos son muy importantes, y el siguiente paso será usar la inteligencia artificial para anticipar la toma de decisiones y el potencial de los jugadores. Los datos nos permiten analizar cada aspecto del juego y mejorar el rendimiento en todos los niveles."',
    'format.wenger.author': '— Arsène Wenger',
    
    // Testimonials
    'testimonials.title': 'Testimonios',
    'testimonials.subtitle': 'Descubre cómo entrenadores de todos los niveles han mejorado con Statsor',
    'testimonials.javier.quote': 'Como director deportivo, Statsor me permite supervisar todos nuestros equipos de manera eficiente. Los informes automáticos y la facilidad para compartir datos entre entrenadores son funcionalidades excepcionales.',
    'testimonials.luisa.quote': 'Lo que más me gusta de Statsor es la facilidad de uso. Puedo acceder desde cualquier dispositivo, incluso desde el campo, y tener toda la información de mi equipo a un clic de distancia.',
    'testimonials.carlos.quote': 'Como preparador físico, las estadísticas y la gestión de carga de trabajo en Statsor son insuperables. Hemos reducido lesiones en un 30% gracias a los entrenamientos personalizados.',
    
    // Pricing
    'pricing.title': 'Escoge tu plan',
    'pricing.subtitle': 'Desbloquea funciones premium para aumentar la productividad y agilizar su flujo de trabajo. Elige el plan que más te convenga.',
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
    'dashboard.command.table': 'Tabla de comandos',
    'dashboard.full.screen': 'Pantalla completa',
    'dashboard.start': 'Iniciar',
    'dashboard.restart': 'Reiniciar',
    'dashboard.pause': 'Pausar',
    'dashboard.actions': 'Acciones',
    'dashboard.action.register': 'Registro Acciones',
    'dashboard.save.stats': 'Guardar Estadísticas',
    'dashboard.go.to.goals': 'Ir a Registro de Goles',
    'dashboard.attendance.control': 'Control de Asistencia',
    'dashboard.attendance.subtitle': 'Registra qué jugadores están presentes en el entrenamiento o partido',
    'dashboard.total.players': 'Total Jugadores',
    'dashboard.present': 'Presentes',
    'dashboard.absent': 'Ausentes',
    'dashboard.player.list': 'Lista de Jugadores',
    'dashboard.attendance.instruction': 'Pulsa el botón para cambiar el estado de asistencia',
    'dashboard.stats.title': 'Estadísticas',
    'dashboard.stats.subtitle': 'Estadísticas generales del equipo en la temporada actual',
    'dashboard.performance': 'Rendimiento',
    'dashboard.attack': 'Ataque',
    'dashboard.defense': 'Defensa',
    'dashboard.discipline': 'Disciplina',
    'dashboard.add.player': 'Añadir Jugador',
    'dashboard.no.order': 'Sin ordenar',
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
    
    // Format Types
    'format.future.title': 'The future of football is NOW',
    'format.wenger.quote': '"We live in a world where data is very important, and the next step will be to use artificial intelligence to anticipate decision-making and player potential. Data allows us to analyze every aspect of the game and improve performance at all levels."',
    'format.wenger.author': '— Arsène Wenger',
    
    // Testimonials
    'testimonials.title': 'Testimonials',
    'testimonials.subtitle': 'Discover how coaches at all levels have improved with Statsor',
    'testimonials.javier.quote': 'As sports director, Statsor allows me to efficiently supervise all our teams. The automatic reports and ease of sharing data between coaches are exceptional features.',
    'testimonials.luisa.quote': 'What I like most about Statsor is the ease of use. I can access from any device, even from the field, and have all my team information at the click of a button.',
    'testimonials.carlos.quote': 'As a physical trainer, the statistics and workload management in Statsor are unbeatable. We have reduced injuries by 30% thanks to personalized training.',
    
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
    'dashboard.command.table': 'Command Table',
    'dashboard.full.screen': 'Full Screen',
    'dashboard.start': 'Start',
    'dashboard.restart': 'Restart',
    'dashboard.pause': 'Pause',
    'dashboard.actions': 'Actions',
    'dashboard.action.register': 'Action Register',
    'dashboard.save.stats': 'Save Statistics',
    'dashboard.go.to.goals': 'Go to Goals Register',
    'dashboard.attendance.control': 'Attendance Control',
    'dashboard.attendance.subtitle': 'Record which players are present at training or match',
    'dashboard.total.players': 'Total Players',
    'dashboard.present': 'Present',
    'dashboard.absent': 'Absent',
    'dashboard.player.list': 'Player List',
    'dashboard.attendance.instruction': 'Press the button to change attendance status',
    'dashboard.stats.title': 'Statistics',
    'dashboard.stats.subtitle': 'General team statistics for the current season',
    'dashboard.performance': 'Performance',
    'dashboard.attack': 'Attack',
    'dashboard.defense': 'Defense',
    'dashboard.discipline': 'Discipline',
    'dashboard.add.player': 'Add Player',
    'dashboard.no.order': 'No order',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('statsor_language');
    return (savedLanguage as Language) || 'es'; // Default to Spanish
  });

  // Save language preference to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem('statsor_language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    if (translation) {
      return translation;
    }
    
    // Fallback to English if Spanish translation is missing
    if (language === 'es' && translations['en'][key]) {
      return translations['en'][key];
    }
    
    // Return the key itself if no translation found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};