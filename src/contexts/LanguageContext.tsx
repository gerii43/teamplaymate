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
    // During development, provide a fallback to prevent crashes
    console.warn('useLanguage called outside LanguageProvider - using fallback');
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      t: (key: string) => key
    };
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

    // Command Table
    'command.table.title': 'Tabla de Comandos',
    'command.actions': 'Acciones',
    'command.players': 'Jugadores',
    'command.start': 'Iniciar',
    'command.pause': 'Pausar',
    'command.restart': 'Reiniciar',
    'command.first.half': 'Primera Parte',
    'command.second.half': 'Segunda Parte',
    'command.select.player': 'Selecciona un jugador primero',
    'command.home.team': 'CD Statsor',
    'command.away.team': 'Equipo',
    
    // Actions
    'action.foul.against': 'FALTA CONTRA',
    'action.foul.favor': 'FALTA A FAVOR',
    'action.penalty.favor': 'PENALTI A FAVOR',
    'action.penalty.against': 'PENALTI EN CONTRA',
    'action.ball.lost': 'BALÓN PERDIDO',
    'action.ball.recovered': 'BALÓN RECUPERADO',
    'action.duel.won': 'DUELO GANADO',
    'action.duel.lost': 'DUELO PERDIDO',
    'action.goal.favor': 'GOL A FAVOR',
    'action.goal.against': 'GOL EN CONTRA',
    'action.assist': 'ASISTENCIA',
    'action.save': 'PARADA',
    'action.shot.goal': 'TIRO A PUERTA',
    'action.shot.out': 'TIRO FUERA',
    'action.corner.favor': 'CÓRNER A FAVOR',
    'action.corner.against': 'CÓRNER EN CONTRA',
    
    // Registered Actions
    'command.registered.actions': 'Acciones Registradas',
    'command.no.actions': 'No hay acciones registradas',
    'command.remove': 'Eliminar',
    'command.edit': 'Editar',
    'command.save': 'Guardar',
    'command.cancel.edit': 'Cancelar',
    'command.reset.default': 'Restablecer',
    'command.configure.actions': 'Configurar Acciones',
    'command.configure.players': 'Configurar Jugadores',
    'command.players.on.field': 'Jugadores en el Campo',
    'command.players.bench': 'Banquillo',
    'command.players.active.inactive': 'Activar/Desactivar Jugadores',
    
    // Goal Origins
    'goal.origin.title': 'Selecciona el origen del gol',
    'goal.origin.set.play': 'Jugada ensayada',
    'goal.origin.duality': 'Dualidad',
    'goal.origin.fast.transition': 'Transición rápida',
    'goal.origin.high.recovery': 'Recuperación alta',
    'goal.origin.individual.action': 'Acción individual',
    'goal.origin.rival.error': 'Error rival',
    'goal.origin.ball.loss.exit': 'Pérdida en salida de balón',
    'goal.origin.defensive.error': 'Error defensivo',
    'goal.origin.won.back': 'Han ganado la espalda',
    'goal.origin.fast.counter': 'Contraataque rápido',
    'goal.origin.rival.superiority': 'Superioridad numérica rival',
    'goal.origin.strategy.goal': 'Gol de estrategia',
    
    // Goal Zone Modal
    'goal.zone.title': 'Selecciona la zona del gol',
    'goal.zone.instructions': 'Elige la zona donde se marcó el gol',
    'goal.zone.cancel': 'Cancelar',

    // Players Page
    'players.title': 'Jugadores',
    'players.add': 'Añadir Jugador',
    'players.select': 'Seleccionar',
    'players.back': 'Atrás',
    'players.position': 'Posición',
    'players.age': 'Edad',
    'players.nationality': 'Nacionalidad',
    'players.height': 'Altura',
    'players.weight': 'Peso',
    'players.dominant.foot': 'Pie dominante',
    'players.goals': 'Goles',
    'players.assists': 'Asistencias',
    'players.games': 'Partidos',
    'players.minutes': 'Minutos',
    'players.shots': 'Tiros',
    'players.shots.target': 'Tiros a puerta',
    'players.passes': 'Pases',
    'players.pass.accuracy': 'Precisión de pase',
    'players.fouls.committed': 'Faltas cometidas',
    'players.fouls.received': 'Faltas recibidas',
    'players.balls.lost': 'Balones perdidos',
    'players.balls.recovered': 'Balones recuperados',
    'players.duels.won': 'Duelos ganados',
    'players.duels.lost': 'Duelos perdidos',
    'players.yellow.cards': 'Tarjetas amarillas',
    'players.red.cards': 'Tarjetas rojas',
    'players.saves': 'Paradas',
    'players.general.stats': 'Estadísticas Generales',
    'players.performance': 'Rendimiento',
    'players.shot.map': 'Mapa de tiros',
    'players.more.stats': 'Más estadísticas',
    'players.less.stats': 'Menos estadísticas',

    // Matches Page
    'matches.title': 'Partidos',
    'matches.completed': 'Completados',
    'matches.upcoming': 'Próximos',
    'matches.match.details': 'Detalles del partido',
    'matches.venue': 'Estadio',
    'matches.download.report': 'Descargar informe',
    'matches.copy.data': 'Copiar datos',
    'matches.first.half': 'Primera parte',
    'matches.second.half': 'Segunda parte',
    'matches.team.stats': 'Estadísticas del equipo',
    'matches.possession': 'Posesión',

    // Training/Attendance Page
    'attendance.title': 'Control de Asistencia',
    'attendance.future': 'Próximos entrenamientos',
    'attendance.past': 'Entrenamientos pasados',
    'attendance.historic': 'Histórico',
    'attendance.add.training': 'Añadir entrenamiento',
    'attendance.team.stats': 'Estadísticas del equipo',
    'attendance.total.trainings': 'Entrenamientos totales',
    'attendance.average.attendance': 'Asistencia promedio',
    'attendance.perfect.attendance': 'Asistencia perfecta',
    'attendance.pending.trainings': 'Entrenamientos pendientes',
    'attendance.present': 'Presente',
    'attendance.absent': 'Ausente',
    'attendance.justified': 'Justificado',
    'attendance.pending': 'Pendiente',
    'attendance.filter.all': 'Todas',
    'attendance.filter.month': 'Último mes',
    'attendance.filter.3months': 'Últimos 3 meses',
    'attendance.filter.season': 'Temporada',
    'attendance.filter.position': 'Filtrar por posición',
    'attendance.player.stats': 'Estadísticas de jugadores',
    'attendance.attendance.rate': 'Tasa de asistencia',
    'attendance.consecutive': 'Consecutivas',
    'attendance.last.absence': 'Última ausencia',

    // Positions
    'position.goalkeeper': 'Portero',
    'position.defender': 'Defensa',
    'position.midfielder': 'Centrocampista',
    'position.forward': 'Delantero',
    'position.por': 'POR',
    'position.def': 'DEF',
    'position.cc': 'CC',
    'position.del': 'DEL',

    // Enhanced Dashboard
    'dashboard.team.performance': 'Rendimiento del Equipo',
    'dashboard.team.evolution': 'Evolución del Equipo',
    'dashboard.top.players': 'Top 5 Jugadores',
    'dashboard.match': 'Partido',
    'dashboard.points': 'Puntos',
    'dashboard.goals.for': 'Goles a favor',
    'dashboard.goals.against': 'Goles en contra',
    'dashboard.victories': 'Victorias',
    'dashboard.player': 'Jugador',
    'dashboard.shots': 'Tiros',
    'dashboard.fouls.received': 'Faltas recibidas',
    'dashboard.fouls.committed': 'Faltas cometidas',
    'dashboard.yellow.cards': 'Tarjetas amarillas',

    // Training Page
    'training.title': 'Entrenamientos',
    'training.add': 'Añadir Entrenamiento',
    'training.name': 'Nombre del entrenamiento',
    'training.date': 'Fecha',
    'training.duration': 'Duración (minutos)',
    'training.type': 'Tipo',
    'training.physical': 'Físico',
    'training.technical': 'Técnico',
    'training.tactical': 'Táctico',
    'training.mixed': 'Mixto',
    'training.description': 'Descripción',
    'training.save': 'Guardar entrenamiento',
    'training.saved': 'Entrenamiento guardado exitosamente',
    'training.error': 'Error al guardar el entrenamiento',
    'training.intensity': 'Intensidad',
    'training.low': 'Baja',
    'training.medium': 'Media',
    'training.high': 'Alta',
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

    // Command Table
    'command.table.title': 'Command Table',
    'command.actions': 'Actions',
    'command.players': 'Players',
    'command.start': 'Start',
    'command.pause': 'Pause',
    'command.restart': 'Restart',
    'command.first.half': 'First Half',
    'command.second.half': 'Second Half',
    'command.select.player': 'Select a player first',
    'command.home.team': 'CD Statsor',
    'command.away.team': 'Team',
    
    // Actions
    'action.foul.against': 'FOUL AGAINST',
    'action.foul.favor': 'FOUL IN FAVOR',
    'action.penalty.favor': 'PENALTY IN FAVOR',
    'action.penalty.against': 'PENALTY AGAINST',
    'action.ball.lost': 'BALL LOST',
    'action.ball.recovered': 'BALL RECOVERED',
    'action.duel.won': 'DUEL WON',
    'action.duel.lost': 'DUEL LOST',
    'action.goal.favor': 'GOAL IN FAVOR',
    'action.goal.against': 'GOAL AGAINST',
    'action.assist': 'ASSIST',
    'action.save': 'SAVE',
    'action.shot.goal': 'SHOT ON GOAL',
    'action.shot.out': 'SHOT OFF TARGET',
    'action.corner.favor': 'CORNER IN FAVOR',
    'action.corner.against': 'CORNER AGAINST',
    
    // Registered Actions
    'command.registered.actions': 'Registered Actions',
    'command.no.actions': 'No actions registered',
    'command.remove': 'Remove',
    'command.edit': 'Edit',
    'command.save': 'Save',
    'command.cancel.edit': 'Cancel',
    'command.reset.default': 'Reset Default',
    'command.configure.actions': 'Configure Actions',
    'command.configure.players': 'Configure Players',
    'command.players.on.field': 'Players on Field',
    'command.players.bench': 'Bench',
    'command.players.active.inactive': 'Activate/Deactivate Players',
    
    // Goal Origins
    'goal.origin.title': 'Select goal origin',
    'goal.origin.set.play': 'Set play',
    'goal.origin.duality': 'Duality',
    'goal.origin.fast.transition': 'Fast transition',
    'goal.origin.high.recovery': 'High recovery',
    'goal.origin.individual.action': 'Individual action',
    'goal.origin.rival.error': 'Rival error',
    'goal.origin.ball.loss.exit': 'Ball loss in exit',
    'goal.origin.defensive.error': 'Defensive error',
    'goal.origin.won.back': 'Won the back',
    'goal.origin.fast.counter': 'Fast counterattack',
    'goal.origin.rival.superiority': 'Rival numerical superiority',
    'goal.origin.strategy.goal': 'Strategy goal',
    
    // Goal Zone Modal
    'goal.zone.title': 'Select goal zone',
    'goal.zone.instructions': 'Choose the zone where the goal was scored',
    'goal.zone.cancel': 'Cancel',

    // Players Page
    'players.title': 'Players',
    'players.add': 'Add Player',
    'players.select': 'Select',
    'players.back': 'Back',
    'players.position': 'Position',
    'players.age': 'Age',
    'players.nationality': 'Nationality',
    'players.height': 'Height',
    'players.weight': 'Weight',
    'players.dominant.foot': 'Dominant foot',
    'players.goals': 'Goals',
    'players.assists': 'Assists',
    'players.games': 'Games',
    'players.minutes': 'Minutes',
    'players.shots': 'Shots',
    'players.shots.target': 'Shots on target',
    'players.passes': 'Passes',
    'players.pass.accuracy': 'Pass accuracy',
    'players.fouls.committed': 'Fouls committed',
    'players.fouls.received': 'Fouls received',
    'players.balls.lost': 'Balls lost',
    'players.balls.recovered': 'Balls recovered',
    'players.duels.won': 'Duels won',
    'players.duels.lost': 'Duels lost',
    'players.yellow.cards': 'Yellow cards',
    'players.red.cards': 'Red cards',
    'players.saves': 'Saves',
    'players.general.stats': 'General Statistics',
    'players.performance': 'Performance',
    'players.shot.map': 'Shot map',
    'players.more.stats': 'More statistics',
    'players.less.stats': 'Less statistics',

    // Matches Page
    'matches.title': 'Matches',
    'matches.completed': 'Completed',
    'matches.upcoming': 'Upcoming',
    'matches.match.details': 'Match details',
    'matches.venue': 'Venue',
    'matches.download.report': 'Download report',
    'matches.copy.data': 'Copy data',
    'matches.first.half': 'First half',
    'matches.second.half': 'Second half',
    'matches.team.stats': 'Team statistics',
    'matches.possession': 'Possession',

    // Training/Attendance Page
    'attendance.title': 'Attendance Control',
    'attendance.future': 'Upcoming trainings',
    'attendance.past': 'Past trainings',
    'attendance.historic': 'Historic',
    'attendance.add.training': 'Add training',
    'attendance.team.stats': 'Team statistics',
    'attendance.total.trainings': 'Total trainings',
    'attendance.average.attendance': 'Average attendance',
    'attendance.perfect.attendance': 'Perfect attendance',
    'attendance.pending.trainings': 'Pending trainings',
    'attendance.present': 'Present',
    'attendance.absent': 'Absent',
    'attendance.justified': 'Justified',
    'attendance.pending': 'Pending',
    'attendance.filter.all': 'All',
    'attendance.filter.month': 'Last month',
    'attendance.filter.3months': 'Last 3 months',
    'attendance.filter.season': 'Season',
    'attendance.filter.position': 'Filter by position',
    'attendance.player.stats': 'Player statistics',
    'attendance.attendance.rate': 'Attendance rate',
    'attendance.consecutive': 'Consecutive',
    'attendance.last.absence': 'Last absence',

    // Positions
    'position.goalkeeper': 'Goalkeeper',
    'position.defender': 'Defender',
    'position.midfielder': 'Midfielder',
    'position.forward': 'Forward',
    'position.por': 'GK',
    'position.def': 'DEF',
    'position.cc': 'MID',
    'position.del': 'FWD',

    // Enhanced Dashboard
    'dashboard.team.performance': 'Team Performance',
    'dashboard.team.evolution': 'Team Evolution',
    'dashboard.top.players': 'Top 5 Players',
    'dashboard.match': 'Match',
    'dashboard.points': 'Points',
    'dashboard.goals.for': 'Goals for',
    'dashboard.goals.against': 'Goals against',
    'dashboard.victories': 'Victories',
    'dashboard.player': 'Player',
    'dashboard.shots': 'Shots',
    'dashboard.fouls.received': 'Fouls received',
    'dashboard.fouls.committed': 'Fouls committed',
    'dashboard.yellow.cards': 'Yellow cards',

    // Training Page
    'training.title': 'Trainings',
    'training.add': 'Add Training',
    'training.name': 'Training name',
    'training.date': 'Date',
    'training.duration': 'Duration (minutes)',
    'training.type': 'Type',
    'training.physical': 'Physical',
    'training.technical': 'Technical',
    'training.tactical': 'Tactical',
    'training.mixed': 'Mixed',
    'training.description': 'Description',
    'training.save': 'Save training',
    'training.saved': 'Training saved successfully',
    'training.error': 'Error saving training',
    'training.intensity': 'Intensity',
    'training.low': 'Low',
    'training.medium': 'Medium',
    'training.high': 'High',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      // Check localStorage for saved language preference
      const savedLanguage = localStorage.getItem('statsor_language');
      return (savedLanguage as Language) || 'es'; // Default to Spanish
    } catch (error) {
      // Fallback if localStorage is not available
      return 'es';
    }
  });

  // Save language preference to localStorage when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('statsor_language', language);
    } catch (error) {
      // Ignore localStorage errors in case of SSR or restricted environments
      console.warn('Failed to save language preference:', error);
    }
  }, [language]);

  const t = React.useCallback((key: string): string => {
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
  }, [language]);

  const contextValue = React.useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};