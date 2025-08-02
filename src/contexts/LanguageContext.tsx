import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
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

interface LanguageProviderProps {
  children: ReactNode;
}

// Clean translations object with no duplicates
const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.pricing': 'Precios',
    'nav.demo': 'Demo',
    'nav.contact': 'Contacto',
    'nav.signin': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    'nav.dashboard': 'Panel',

    // Hero section
    'hero.title.digitize': 'Digitaliza tu equipo de fútbol',
    'hero.subtitle': 'Software integral para entrenadores de fútbol que revoluciona la gestión de equipos, estadísticas y entrenamientos',

    // Features
    'features.title': 'Características Principales',
    'features.subtitle': 'Todo lo que necesitas para gestionar tu equipo profesionalmente',
    'features.training.title': 'Gestión de Entrenamientos',
    'features.training.description': 'Planifica y registra entrenamientos con ejercicios personalizados',
    'features.attendance.title': 'Control de Asistencia',
    'features.attendance.description': 'Seguimiento completo de la asistencia de jugadores',
    'features.stats.title': 'Estadísticas Avanzadas',
    'features.stats.description': 'Análisis detallado del rendimiento individual y del equipo',
    'features.reports.title': 'Informes Profesionales',
    'features.reports.description': 'Genera informes detallados y exporta datos fácilmente',

    // Benefits
    'benefits.title': 'Beneficios Clave',
    'benefits.subtitle': 'Descubre por qué Statsor es la mejor opción para tu equipo',
    'benefits.tactile.title': 'Interfaz Táctil',
    'benefits.tactile.description': 'Optimizado para tablets y dispositivos móviles',
    'benefits.analysis.title': 'Análisis Inteligente',
    'benefits.analysis.description': 'IA que te ayuda a tomar mejores decisiones tácticas',
    'benefits.offline.title': 'Funciona Sin Internet',
    'benefits.offline.description': 'Registra datos incluso sin conexión a internet',
    'benefits.reports.title': 'Informes Automáticos',
    'benefits.reports.description': 'Genera informes profesionales automáticamente',

    // Pricing
    'pricing.title': 'Planes de Precios',
    'pricing.subtitle': 'Elige el plan que mejor se adapte a tus necesidades',
    'pricing.monthly': 'Mensual',
    'pricing.annual': 'Anual',
    'pricing.save': 'Ahorra 20%',
    'pricing.starter.title': 'Starter',
    'pricing.starter.price': 'Gratis',
    'pricing.starter.period': 'por mes',
    'pricing.pro.title': 'Pro',
    'pricing.pro.period': 'por mes',
    'pricing.club.title': 'Club',
    'pricing.club.price': 'Personalizado',
    'pricing.club.period': 'por mes',

    // CTA
    'cta.title': '¿Listo para revolucionar tu equipo?',
    'cta.subtitle': 'Únete a miles de entrenadores que ya usan Statsor',
    'cta.button': 'Comenzar Gratis',

    // Testimonials
    'testimonials.title': 'Lo que dicen nuestros usuarios',
    'testimonials.subtitle': 'Testimonios reales de entrenadores profesionales',
    'testimonials.javier.quote': 'Statsor ha transformado completamente la forma en que gestiono mi equipo. Las estadísticas en tiempo real son increíbles.',
    'testimonials.luisa.quote': 'La facilidad de uso y las funciones específicas para futsal han mejorado significativamente nuestro rendimiento.',
    'testimonials.carlos.quote': 'El control de asistencia y la planificación de entrenamientos nos han ahorrado horas de trabajo administrativo.',

    // Footer
    'footer.product': 'Producto',
    'footer.resources': 'Recursos',
    'footer.company': 'Empresa',
    'footer.rights': '© 2024 Statsor. Todos los derechos reservados.',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',

    // Auth
    'auth.signin.title': 'Iniciar Sesión',
    'auth.signin.subtitle': 'Accede a tu cuenta de Statsor',
    'auth.signin.button': 'Iniciar Sesión',
    'auth.signup.title': 'Crear Cuenta',
    'auth.signup.subtitle': 'Únete a la revolución del fútbol digital',
    'auth.signup.button': 'Crear Cuenta',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.forgot.password': '¿Olvidaste tu contraseña?',
    'auth.no.account': '¿No tienes cuenta?',
    'auth.have.account': '¿Ya tienes cuenta?',
    'auth.signin.link': 'Inicia sesión',
    'auth.signup.link': 'Regístrate',
    'auth.google.button': 'Continuar con Google',

    // Dashboard
    'dashboard.welcome': 'Bienvenido',
    'dashboard.home': 'Inicio',
    'dashboard.points': 'Puntos',
    'dashboard.victories': 'Victorias',
    'dashboard.current.season': 'Temporada Actual',
    'dashboard.add.team': 'Agregar Equipo',
    'dashboard.create.team': 'Crear Nuevo Equipo',
    'dashboard.team.name': 'Nombre del Equipo',
    'dashboard.enter.team.name': 'Ingresa el nombre del equipo',
    'dashboard.cancel': 'Cancelar',
    'dashboard.create.team.button': 'Crear Equipo',
    'dashboard.subscription': 'Suscripción',
    'dashboard.current.plan': 'Plan Actual',
    'dashboard.status': 'Estado',
    'dashboard.manage.subscription': 'Gestionar Suscripción',
    'dashboard.quick.actions': 'Acciones Rápidas',
    'dashboard.add.player': 'Agregar Jugador',
    'dashboard.create.match': 'Crear Partido',
    'dashboard.view.stats': 'Ver Estadísticas',
    'dashboard.recent.activity': 'Actividad Reciente',
    'dashboard.no.activity': 'No hay actividad reciente',
    'dashboard.player.management': 'Gestión de Jugadores',
    'dashboard.tactical.chat': 'Chat Táctico',

    // Sport Selection
    'sport.selection.title': 'Selecciona tu Deporte',
    'sport.selection.subtitle': 'Elige el deporte principal para personalizar tu experiencia',
    'sport.selection.selected': '¡Seleccionado!',
    'sport.selection.confirm': 'Confirmar Selección',
    'sport.soccer': 'Fútbol',
    'sport.futsal': 'Futsal',
    'sport.soccer.description': 'Fútbol tradicional de 11 jugadores',
    'sport.futsal.description': 'Fútbol sala de 5 jugadores',
    'sport.soccer.feature1': 'Gestión de plantillas de hasta 25 jugadores',
    'sport.soccer.feature2': 'Análisis táctico para formaciones 11vs11',
    'sport.soccer.feature3': 'Seguimiento de posiciones específicas',
    'sport.soccer.feature4': 'Estadísticas de partidos completos (90 min)',
    'sport.futsal.feature1': 'Control de rotaciones intensivas',
    'sport.futsal.feature2': 'Análisis de juego en espacio reducido',
    'sport.futsal.feature3': 'Métricas de intensidad y ritmo',
    'sport.futsal.feature4': 'Estadísticas de partidos (40 min)',

    // Goal locations
    'goal.location.title': 'Ubicación del Gol',
    'goal.location.subtitle': 'Selecciona dónde se marcó el gol',
    'goal.location.top.left': 'Arriba Izquierda',
    'goal.location.top.center': 'Arriba Centro',
    'goal.location.top.right': 'Arriba Derecha',
    'goal.location.middle.left': 'Centro Izquierda',
    'goal.location.middle.center': 'Centro',
    'goal.location.middle.right': 'Centro Derecha',
    'goal.location.bottom.left': 'Abajo Izquierda',
    'goal.location.bottom.center': 'Abajo Centro',
    'goal.location.bottom.right': 'Abajo Derecha',
    'goal.location.goal.target': 'Gol',
    'goal.location.cancel': 'Cancelar',

    // Photo upload
    'photo.upload.title': 'Subir Foto',
    'photo.upload.select': 'Seleccionar Foto',
    'photo.upload.selected': 'Seleccionada',
    'photo.upload.size': 'Tamaño',
    'photo.upload.cancel': 'Cancelar',
    'photo.upload.save': 'Guardar Foto',

    // Command table
    'command.select.player': 'Por favor selecciona un jugador primero',
    'command.start': 'Iniciar',
    'command.pause': 'Pausar',
    'command.restart': 'Reiniciar',
    'command.first.half': '1er Tiempo',
    'command.second.half': '2do Tiempo',
    'command.home.team': 'Equipo Local',
    'command.away.team': 'Equipo Visitante',
    'command.actions': 'Acciones',
    'command.players': 'Jugadores',
    'command.registered.actions': 'Acciones Registradas',
    'command.no.actions': 'No hay acciones registradas aún',

    // Goal zones and origins
    'goal.zone.title': 'Zona del Gol',
    'goal.zone.cancel': 'Cancelar',
    'goal.origin.title': 'Origen del Gol',
    'goal.origin.set.play': 'Jugada de Pelota Parada',
    'goal.origin.duality': 'Dualidad',
    'goal.origin.fast.transition': 'Transición Rápida',
    'goal.origin.high.recovery': 'Recuperación Alta',
    'goal.origin.individual.action': 'Acción Individual',
    'goal.origin.rival.error': 'Error del Rival',
    'goal.origin.ball.loss.exit': 'Salida por Pérdida',
    'goal.origin.defensive.error': 'Error Defensivo',
    'goal.origin.won.back': 'Recuperado',
    'goal.origin.fast.counter': 'Contraataque Rápido',
    'goal.origin.rival.superiority': 'Superioridad del Rival',
    'goal.origin.strategy.goal': 'Gol Estratégico',

    // General
    'general.season': 'Temporada',

    // Blog
    'blog.title': 'Blog'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.pricing': 'Pricing',
    'nav.demo': 'Demo',
    'nav.contact': 'Contact',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',

    // Hero section
    'hero.title.digitize': 'Digitize your football team',
    'hero.subtitle': 'Comprehensive software for coaches that revolutionizes team management, statistics and training',

    // Features
    'features.title': 'Key Features',
    'features.subtitle': 'Everything you need to manage your team professionally',
    'features.training.title': 'Training Management',
    'features.training.description': 'Plan and record training sessions with custom exercises',
    'features.attendance.title': 'Attendance Control',
    'features.attendance.description': 'Complete tracking of player attendance',
    'features.stats.title': 'Advanced Statistics',
    'features.stats.description': 'Detailed analysis of individual and team performance',
    'features.reports.title': 'Professional Reports',
    'features.reports.description': 'Generate detailed reports and export data easily',

    // Benefits
    'benefits.title': 'Key Benefits',
    'benefits.subtitle': 'Discover why Statsor is the best choice for your team',
    'benefits.tactile.title': 'Touch Interface',
    'benefits.tactile.description': 'Optimized for tablets and mobile devices',
    'benefits.analysis.title': 'Smart Analysis',
    'benefits.analysis.description': 'AI that helps you make better tactical decisions',
    'benefits.offline.title': 'Works Offline',
    'benefits.offline.description': 'Record data even without internet connection',
    'benefits.reports.title': 'Automatic Reports',
    'benefits.reports.description': 'Generate professional reports automatically',

    // Pricing
    'pricing.title': 'Pricing Plans',
    'pricing.subtitle': 'Choose the plan that best fits your needs',
    'pricing.monthly': 'Monthly',
    'pricing.annual': 'Annual',
    'pricing.save': 'Save 20%',
    'pricing.starter.title': 'Starter',
    'pricing.starter.price': 'Free',
    'pricing.starter.period': 'per month',
    'pricing.pro.title': 'Pro',
    'pricing.pro.period': 'per month',
    'pricing.club.title': 'Club',
    'pricing.club.price': 'Custom',
    'pricing.club.period': 'per month',

    // CTA
    'cta.title': 'Ready to revolutionize your team?',
    'cta.subtitle': 'Join thousands of coaches already using Statsor',
    'cta.button': 'Start Free',

    // Testimonials
    'testimonials.title': 'What our users say',
    'testimonials.subtitle': 'Real testimonials from professional coaches',
    'testimonials.javier.quote': 'Statsor has completely transformed the way I manage my team. Real-time statistics are incredible.',
    'testimonials.luisa.quote': 'The ease of use and futsal-specific features have significantly improved our performance.',
    'testimonials.carlos.quote': 'Attendance control and training planning have saved us hours of administrative work.',

    // Footer
    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
    'footer.rights': '© 2024 Statsor. All rights reserved.',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',

    // Auth
    'auth.signin.title': 'Sign In',
    'auth.signin.subtitle': 'Access your Statsor account',
    'auth.signin.button': 'Sign In',
    'auth.signup.title': 'Create Account',
    'auth.signup.subtitle': 'Join the digital football revolution',
    'auth.signup.button': 'Create Account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgot.password': 'Forgot your password?',
    'auth.no.account': "Don't have an account?",
    'auth.have.account': 'Already have an account?',
    'auth.signin.link': 'Sign in',
    'auth.signup.link': 'Sign up',
    'auth.google.button': 'Continue with Google',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.home': 'Home',
    'dashboard.points': 'Points',
    'dashboard.victories': 'Victories',
    'dashboard.current.season': 'Current Season',
    'dashboard.add.team': 'Add Team',
    'dashboard.create.team': 'Create New Team',
    'dashboard.team.name': 'Team Name',
    'dashboard.enter.team.name': 'Enter team name',
    'dashboard.cancel': 'Cancel',
    'dashboard.create.team.button': 'Create Team',
    'dashboard.subscription': 'Subscription',
    'dashboard.current.plan': 'Current Plan',
    'dashboard.status': 'Status',
    'dashboard.manage.subscription': 'Manage Subscription',
    'dashboard.quick.actions': 'Quick Actions',
    'dashboard.add.player': 'Add Player',
    'dashboard.create.match': 'Create Match',
    'dashboard.view.stats': 'View Stats',
    'dashboard.recent.activity': 'Recent Activity',
    'dashboard.no.activity': 'No recent activity',
    'dashboard.player.management': 'Player Management',
    'dashboard.tactical.chat': 'Tactical Chat',

    // Sport Selection
    'sport.selection.title': 'Select Your Sport',
    'sport.selection.subtitle': 'Choose your main sport to customize your experience',
    'sport.selection.selected': 'Selected!',
    'sport.selection.confirm': 'Confirm Selection',
    'sport.soccer': 'Soccer',
    'sport.futsal': 'Futsal',
    'sport.soccer.description': 'Traditional 11-player football',
    'sport.futsal.description': '5-player indoor football',
    'sport.soccer.feature1': 'Squad management up to 25 players',
    'sport.soccer.feature2': 'Tactical analysis for 11vs11 formations',
    'sport.soccer.feature3': 'Specific position tracking',
    'sport.soccer.feature4': 'Full match statistics (90 min)',
    'sport.futsal.feature1': 'Intensive rotation control',
    'sport.futsal.feature2': 'Small space game analysis',
    'sport.futsal.feature3': 'Intensity and pace metrics',
    'sport.futsal.feature4': 'Match statistics (40 min)',

    // Goal locations
    'goal.location.title': 'Goal Location',
    'goal.location.subtitle': 'Select where the goal was scored',
    'goal.location.top.left': 'Top Left',
    'goal.location.top.center': 'Top Center',
    'goal.location.top.right': 'Top Right',
    'goal.location.middle.left': 'Middle Left',
    'goal.location.middle.center': 'Middle Center',
    'goal.location.middle.right': 'Middle Right',
    'goal.location.bottom.left': 'Bottom Left',
    'goal.location.bottom.center': 'Bottom Center',
    'goal.location.bottom.right': 'Bottom Right',
    'goal.location.goal.target': 'Goal',
    'goal.location.cancel': 'Cancel',

    // Photo upload
    'photo.upload.title': 'Upload Photo',
    'photo.upload.select': 'Select Photo',
    'photo.upload.selected': 'Selected',
    'photo.upload.size': 'Size',
    'photo.upload.cancel': 'Cancel',
    'photo.upload.save': 'Save Photo',

    // Command table
    'command.select.player': 'Please select a player first',
    'command.start': 'Start',
    'command.pause': 'Pause',
    'command.restart': 'Restart',
    'command.first.half': '1st Half',
    'command.second.half': '2nd Half',
    'command.home.team': 'Home Team',
    'command.away.team': 'Away Team',
    'command.actions': 'Actions',
    'command.players': 'Players',
    'command.registered.actions': 'Registered Actions',
    'command.no.actions': 'No actions registered yet',

    // Goal zones and origins
    'goal.zone.title': 'Goal Zone',
    'goal.zone.cancel': 'Cancel',
    'goal.origin.title': 'Goal Origin',
    'goal.origin.set.play': 'Set Play',
    'goal.origin.duality': 'Duality',
    'goal.origin.fast.transition': 'Fast Transition',
    'goal.origin.high.recovery': 'High Recovery',
    'goal.origin.individual.action': 'Individual Action',
    'goal.origin.rival.error': 'Rival Error',
    'goal.origin.ball.loss.exit': 'Ball Loss Exit',
    'goal.origin.defensive.error': 'Defensive Error',
    'goal.origin.won.back': 'Won Back',
    'goal.origin.fast.counter': 'Fast Counter',
    'goal.origin.rival.superiority': 'Rival Superiority',
    'goal.origin.strategy.goal': 'Strategy Goal',

    // General
    'general.season': 'Season',

    // Blog
    'blog.title': 'Blog'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem('statsor_language');
      return (savedLanguage as Language) || 'es';
    } catch (error) {
      return 'es';
    }
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem('statsor_language', newLanguage);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Try fallback to English if key not found in current language
        let fallbackValue: any = translations.en;
        for (const fallbackKey of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
            fallbackValue = fallbackValue[fallbackKey];
          } else {
            // If not found in English either, return a readable version of the key
            return key.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || key;
          }
        }
        return typeof fallbackValue === 'string' ? fallbackValue : key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};