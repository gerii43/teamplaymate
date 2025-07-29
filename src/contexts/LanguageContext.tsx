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

// Comprehensive translations object
const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.pricing': 'Precios',
    'nav.demo': 'Demo',
    'nav.contact': 'Contacto',
    'nav.signin': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.demo': 'Demo',
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
    'dashboard.days.ago': 'hace {days} días',
    'dashboard.matches.of': '{current} de {total} partidos',
    'dashboard.team.division': 'División: {division}',
    'dashboard.team.evolution': 'Evolución del Equipo',
    'dashboard.goals.for': 'Goles a Favor',
    'dashboard.goals.against': 'Goles en Contra',
    'dashboard.top.players': 'Top 5 Jugadores',
    'dashboard.player': 'Jugador',
    'dashboard.shots': 'Tiros',

    // Sidebar
    'sidebar.home': 'Inicio',
    'sidebar.players': 'Jugadores',
    'sidebar.trainings': 'Entrenamientos',
    'sidebar.matches': 'Partidos',
    'sidebar.general.stats': 'Estadísticas Generales',
    'sidebar.attendance': 'Asistencia',
    'sidebar.manual.actions': 'Acciones Manuales',
    'sidebar.command.table': 'Mesa de Mandos',
    'sidebar.tactical.chat': 'Chat Táctico',
    'sidebar.advanced.analytics': 'Analíticas Avanzadas',
    'sidebar.database.status': 'Estado de Base de Datos',

    // Players
    'players.title': 'Gestión de Jugadores',
    'players.add': 'Añadir Jugador',
    'players.back': 'Volver',
    'players.goals': 'Goles',
    'players.assists': 'Asistencias',
    'players.games': 'Partidos',
    'players.minutes': 'Minutos',
    'players.position': 'Posición',
    'players.performance': 'Rendimiento',
    'players.shot.map': 'Mapa de Tiros',
    'players.general.stats': 'Estadísticas Generales',
    'players.more.stats': 'Ver Más Estadísticas',

    // Positions
    'position.goalkeeper': 'Portero',
    'position.defender': 'Defensa',
    'position.midfielder': 'Centrocampista',
    'position.forward': 'Delantero',

    // Matches
    'matches.title': 'Gestión de Partidos',
    'matches.completed': 'Completado',
    'matches.upcoming': 'Próximo',
    'matches.first.half': 'Primera Parte',
    'matches.second.half': 'Segunda Parte',

    // Stats
    'stats.title': 'Estadísticas Generales',
    'stats.performance': 'Rendimiento',
    'stats.attack': 'Ataque',
    'stats.defense': 'Defensa',
    'stats.discipline': 'Disciplina',
    'stats.wins': 'Victorias',
    'stats.draws': 'Empates',
    'stats.losses': 'Derrotas',
    'stats.goals.for': 'Goles a Favor',
    'stats.goals.against': 'Goles en Contra',
    'stats.assists.total': 'Asistencias Totales',
    'stats.shots.goal': 'Tiros a Portería',
    'stats.shots.out': 'Tiros Fuera',
    'stats.balls.recovered': 'Balones Recuperados',
    'stats.duels.won': 'Duelos Ganados',
    'stats.saves': 'Paradas',
    'stats.fouls.committed': 'Faltas Cometidas',
    'stats.fouls.received': 'Faltas Recibidas',
    'stats.yellow.cards': 'Tarjetas Amarillas',
    'stats.red.cards': 'Tarjetas Rojas',

    // Attendance
    'attendance.title': 'Control de Asistencia',
    'attendance.add.training': 'Añadir Entrenamiento',
    'attendance.future.trainings': 'Entrenamientos Futuros',
    'attendance.past.trainings': 'Entrenamientos Pasados',
    'attendance.historic': 'Histórico',
    'attendance.completed': 'Completado',
    'attendance.in.progress': 'En Progreso',
    'attendance.pending': 'Pendiente',
    'attendance.present': 'Presente',
    'attendance.absent': 'Ausente',
    'attendance.justified': 'Justificado',
    'attendance.filters': 'Filtros',
    'attendance.period': 'Período',
    'attendance.all.trainings': 'Todos los entrenamientos',
    'attendance.last.month': 'Último mes',
    'attendance.last.3.months': 'Últimos 3 meses',
    'attendance.current.season': 'Temporada actual',
    'attendance.all.positions': 'Todas las posiciones',
    'attendance.goalkeeper': 'Portero',
    'attendance.defender': 'Defensa',
    'attendance.midfielder': 'Centrocampista',
    'attendance.forward': 'Delantero',
    'attendance.total.players': 'Total Jugadores',
    'attendance.average.attendance': 'Asistencia Promedio',
    'attendance.best.attendance': 'Mejor Asistencia',

    // Manual Actions
    'manual.actions.title': 'Acciones Manuales',
    'manual.actions.subtitle': 'Registro manual de estadísticas en tiempo real',
    'manual.actions.realtime': 'Tiempo Real',
    'manual.actions.player': 'Jugador',
    'manual.actions.goals': 'Goles',
    'manual.actions.assists': 'Asistencias',
    'manual.actions.balls.lost': 'Balones Perdidos',
    'manual.actions.balls.recovered': 'Balones Recuperados',
    'manual.actions.duels.won': 'Duelos Ganados',
    'manual.actions.duels.lost': 'Duelos Perdidos',
    'manual.actions.shots.target': 'Tiros a Portería',
    'manual.actions.shots.off': 'Tiros Fuera',
    'manual.actions.fouls.committed': 'Faltas Cometidas',
    'manual.actions.fouls.received': 'Faltas Recibidas',
    'manual.actions.saves': 'Paradas',
    'manual.actions.na': 'N/A',

    // Command Table
    'command.select.player': 'Selecciona un jugador primero',
    'command.first.half': 'Primera Parte',
    'command.second.half': 'Segunda Parte',
    'command.start': 'Iniciar',
    'command.pause': 'Pausar',
    'command.restart': 'Reiniciar',
    'command.home.team': 'CD Statsor',
    'command.away.team': 'Rival',
    'command.actions': 'Acciones',
    'command.players': 'Jugadores',
    'command.registered.actions': 'Acciones Registradas',
    'command.no.actions': 'No hay acciones registradas',
    'command.edit': 'Editar',
    'command.cancel.edit': 'Cancelar',
    'command.save': 'Guardar',
    'command.reset.default': 'Restablecer',
    'command.configure.actions': 'Configurar Acciones',
    'command.players.active.inactive': 'Jugadores Activos/Inactivos',
    'command.players.on.field': 'Jugadores en Campo',

    // Actions
    'action.goal_favor': 'Gol a Favor',
    'action.goal_against': 'Gol en Contra',
    'action.assist': 'Asistencia',
    'action.foul_favor': 'Falta a Favor',
    'action.foul_against': 'Falta en Contra',
    'action.shot_goal': 'Tiro a Portería',
    'action.shot_out': 'Tiro Fuera',
    'action.corner_favor': 'Córner a Favor',
    'action.corner_against': 'Córner en Contra',
    'action.offside': 'Fuera de Juego',
    'action.penalty_favor': 'Penalti a Favor',
    'action.penalty_against': 'Penalti en Contra',
    'action.double_penalty_goal': 'Gol Doble Penalti',
    'action.accumulated_foul': 'Falta Acumulada',
    'action.time_out': 'Tiempo Muerto',
    'action.flying_goalkeeper': 'Portero Volante',

    // Goal Location
    'goal.location.title': 'Seleccionar Ubicación del Gol',
    'goal.location.subtitle': 'Haz clic en la zona donde entró el gol',
    'goal.location.top.left': 'Sup. Izq.',
    'goal.location.top.center': 'Sup. Centro',
    'goal.location.top.right': 'Sup. Der.',
    'goal.location.middle.left': 'Med. Izq.',
    'goal.location.middle.center': 'Med. Centro',
    'goal.location.middle.right': 'Med. Der.',
    'goal.location.bottom.left': 'Inf. Izq.',
    'goal.location.bottom.center': 'Inf. Centro',
    'goal.location.bottom.right': 'Inf. Der.',
    'goal.location.goal.target': 'Portería',
    'goal.location.cancel': 'Cancelar',

    // Goal Zone
    'goal.zone.title': 'Seleccionar Zona del Gol',
    'goal.zone.cancel': 'Cancelar',

    // Goal Origin
    'goal.origin.title': 'Origen del Gol',
    'goal.origin.set.play': 'Jugada Ensayada',
    'goal.origin.duality': 'Dualidad',
    'goal.origin.fast.transition': 'Transición Rápida',
    'goal.origin.high.recovery': 'Recuperación Alta',
    'goal.origin.individual.action': 'Acción Individual',
    'goal.origin.rival.error': 'Error Rival',
    'goal.origin.ball.loss.exit': 'Pérdida Salida',
    'goal.origin.defensive.error': 'Error Defensivo',
    'goal.origin.won.back': 'Balón Ganado Atrás',
    'goal.origin.fast.counter': 'Contraataque Rápido',
    'goal.origin.rival.superiority': 'Superioridad Rival',
    'goal.origin.strategy.goal': 'Gol Estrategia',

    // Match Notes
    'match.notes.title': 'Notas del Partido',
    'match.notes.add.new': 'Añadir Nueva Nota',
    'match.notes.minute': 'Minuto',
    'match.notes.category': 'Categoría',
    'match.notes.title': 'Título',
    'match.notes.content': 'Contenido',
    'match.notes.tactical': 'Táctico',
    'match.notes.performance': 'Rendimiento',
    'match.notes.injury': 'Lesión',
    'match.notes.general': 'General',
    'match.notes.title.placeholder': 'Ej: Cambio táctico efectivo',
    'match.notes.content.placeholder': 'Describe la observación...',
    'match.notes.add': 'Añadir Nota',
    'match.notes.list': 'Lista de Notas',
    'match.notes.empty': 'No hay notas para este partido',
    'match.notes.cancel': 'Cancelar',
    'match.notes.save': 'Guardar Notas',

    // Photo Upload
    'photo.upload.title': 'Subir Foto de Jugador',
    'photo.upload.select': 'Seleccionar Archivo',
    'photo.upload.selected': 'Archivo seleccionado',
    'photo.upload.size': 'Tamaño',
    'photo.upload.cancel': 'Cancelar',
    'photo.upload.save': 'Guardar Foto',

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

    // Positions
    'position.goalkeeper': 'Portero',
    'position.defender': 'Defensa',
    'position.midfielder': 'Centrocampista',
    'position.forward': 'Delantero',

    // Matches
    'matches.title': 'Gestión de Partidos',
    'matches.completed': 'Completado',
    'matches.upcoming': 'Próximo',
    'matches.first.half': 'Primera Parte',
    'matches.second.half': 'Segunda Parte',

    // Stats
    'stats.title': 'Estadísticas Generales',
    'stats.performance': 'Rendimiento',
    'stats.attack': 'Ataque',
    'stats.defense': 'Defensa',
    'stats.discipline': 'Disciplina',
    'stats.wins': 'Victorias',
    'stats.draws': 'Empates',
    'stats.losses': 'Derrotas',
    'stats.goals.for': 'Goles a Favor',
    'stats.goals.against': 'Goles en Contra',
    'stats.assists.total': 'Asistencias Totales',
    'stats.shots.goal': 'Tiros a Portería',
    'stats.shots.out': 'Tiros Fuera',
    'stats.balls.recovered': 'Balones Recuperados',
    'stats.duels.won': 'Duelos Ganados',
    'stats.saves': 'Paradas',
    'stats.fouls.committed': 'Faltas Cometidas',
    'stats.fouls.received': 'Faltas Recibidas',
    'stats.yellow.cards': 'Tarjetas Amarillas',
    'stats.red.cards': 'Tarjetas Rojas',

    // Attendance
    'attendance.title': 'Control de Asistencia',
    'attendance.add.training': 'Añadir Entrenamiento',
    'attendance.future.trainings': 'Entrenamientos Futuros',
    'attendance.past.trainings': 'Entrenamientos Pasados',
    'attendance.historic': 'Histórico',
    'attendance.completed': 'Completado',
    'attendance.in.progress': 'En Progreso',
    'attendance.pending': 'Pendiente',
    'attendance.present': 'Presente',
    'attendance.absent': 'Ausente',
    'attendance.justified': 'Justificado',
    'attendance.filters': 'Filtros',
    'attendance.period': 'Período',
    'attendance.all.trainings': 'Todos los entrenamientos',
    'attendance.last.month': 'Último mes',
    'attendance.last.3.months': 'Últimos 3 meses',
    'attendance.current.season': 'Temporada actual',
    'attendance.all.positions': 'Todas las posiciones',
    'attendance.goalkeeper': 'Portero',
    'attendance.defender': 'Defensa',
    'attendance.midfielder': 'Centrocampista',
    'attendance.forward': 'Delantero',
    'attendance.total.players': 'Total Jugadores',
    'attendance.average.attendance': 'Asistencia Promedio',
    'attendance.best.attendance': 'Mejor Asistencia',

    // Manual Actions
    'manual.actions.title': 'Acciones Manuales',
    'manual.actions.subtitle': 'Registro manual de estadísticas en tiempo real',
    'manual.actions.realtime': 'Tiempo Real',
    'manual.actions.player': 'Jugador',
    'manual.actions.goals': 'Goles',
    'manual.actions.assists': 'Asistencias',
    'manual.actions.balls.lost': 'Balones Perdidos',
    'manual.actions.balls.recovered': 'Balones Recuperados',
    'manual.actions.duels.won': 'Duelos Ganados',
    'manual.actions.duels.lost': 'Duelos Perdidos',
    'manual.actions.shots.target': 'Tiros a Portería',
    'manual.actions.shots.off': 'Tiros Fuera',
    'manual.actions.fouls.committed': 'Faltas Cometidas',
    'manual.actions.fouls.received': 'Faltas Recibidas',
    'manual.actions.saves': 'Paradas',
    'manual.actions.na': 'N/A',

    // Command Table
    'command.select.player': 'Selecciona un jugador primero',
    'command.first.half': 'Primera Parte',
    'command.second.half': 'Segunda Parte',
    'command.start': 'Iniciar',
    'command.pause': 'Pausar',
    'command.restart': 'Reiniciar',
    'command.home.team': 'CD Statsor',
    'command.away.team': 'Rival',
    'command.actions': 'Acciones',
    'command.players': 'Jugadores',
    'command.registered.actions': 'Acciones Registradas',
    'command.no.actions': 'No hay acciones registradas',
    'command.edit': 'Editar',
    'command.cancel.edit': 'Cancelar',
    'command.save': 'Guardar',
    'command.reset.default': 'Restablecer',
    'command.configure.actions': 'Configurar Acciones',
    'command.players.active.inactive': 'Jugadores Activos/Inactivos',
    'command.players.on.field': 'Jugadores en Campo',

    // Actions
    'action.goal_favor': 'Gol a Favor',
    'action.goal_against': 'Gol en Contra',
    'action.assist': 'Asistencia',
    'action.foul_favor': 'Falta a Favor',
    'action.foul_against': 'Falta en Contra',
    'action.shot_goal': 'Tiro a Portería',
    'action.shot_out': 'Tiro Fuera',
    'action.corner_favor': 'Córner a Favor',
    'action.corner_against': 'Córner en Contra',
    'action.offside': 'Fuera de Juego',
    'action.penalty_favor': 'Penalti a Favor',
    'action.penalty_against': 'Penalti en Contra',
    'action.double_penalty_goal': 'Gol Doble Penalti',
    'action.accumulated_foul': 'Falta Acumulada',
    'action.time_out': 'Tiempo Muerto',
    'action.flying_goalkeeper': 'Portero Volante',

    // Goal Location
    'goal.location.title': 'Seleccionar Ubicación del Gol',
    'goal.location.subtitle': 'Haz clic en la zona donde entró el gol',
    'goal.location.top.left': 'Sup. Izq.',
    'goal.location.top.center': 'Sup. Centro',
    'goal.location.top.right': 'Sup. Der.',
    'goal.location.middle.left': 'Med. Izq.',
    'goal.location.middle.center': 'Med. Centro',
    'goal.location.middle.right': 'Med. Der.',
    'goal.location.bottom.left': 'Inf. Izq.',
    'goal.location.bottom.center': 'Inf. Centro',
    'goal.location.bottom.right': 'Inf. Der.',
    'goal.location.goal.target': 'Portería',
    'goal.location.cancel': 'Cancelar',

    // Goal Zone
    'goal.zone.title': 'Seleccionar Zona del Gol',
    'goal.zone.cancel': 'Cancelar',

    // Goal Origin
    'goal.origin.title': 'Origen del Gol',
    'goal.origin.set.play': 'Jugada Ensayada',
    'goal.origin.duality': 'Dualidad',
    'goal.origin.fast.transition': 'Transición Rápida',
    'goal.origin.high.recovery': 'Recuperación Alta',
    'goal.origin.individual.action': 'Acción Individual',
    'goal.origin.rival.error': 'Error Rival',
    'goal.origin.ball.loss.exit': 'Pérdida Salida',
    'goal.origin.defensive.error': 'Error Defensivo',
    'goal.origin.won.back': 'Balón Ganado Atrás',
    'goal.origin.fast.counter': 'Contraataque Rápido',
    'goal.origin.rival.superiority': 'Superioridad Rival',
    'goal.origin.strategy.goal': 'Gol Estrategia',

    // Match Notes
    'match.notes.title': 'Notas del Partido',
    'match.notes.add.new': 'Añadir Nueva Nota',
    'match.notes.minute': 'Minuto',
    'match.notes.category': 'Categoría',
    'match.notes.title': 'Título',
    'match.notes.content': 'Contenido',
    'match.notes.tactical': 'Táctico',
    'match.notes.performance': 'Rendimiento',
    'match.notes.injury': 'Lesión',
    'match.notes.general': 'General',
    'match.notes.title.placeholder': 'Ej: Cambio táctico efectivo',
    'match.notes.content.placeholder': 'Describe la observación...',
    'match.notes.add': 'Añadir Nota',
    'match.notes.list': 'Lista de Notas',
    'match.notes.empty': 'No hay notas para este partido',
    'match.notes.cancel': 'Cancelar',
    'match.notes.save': 'Guardar Notas',

    // Photo Upload
    'photo.upload.title': 'Subir Foto de Jugador',
    'photo.upload.select': 'Seleccionar Archivo',
    'photo.upload.selected': 'Archivo seleccionado',
    'photo.upload.size': 'Tamaño',
    'photo.upload.cancel': 'Cancelar',
    'photo.upload.save': 'Guardar Foto',

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

    // Format
    'format.future.title': 'El futuro del fútbol es digital',
    'format.wenger.quote': 'El fútbol del futuro será más táctico, más técnico y más inteligente. La tecnología nos ayudará a entender mejor el juego.',
    'format.wenger.author': '- Arsène Wenger, Ex-entrenador del Arsenal',

    // General
    'general.season': 'Temporada',

    // Blog
    // Sport selection
    'sport.selection.title': 'Choose Your Sport',
    'sport.selection.subtitle': 'Select your preferred sport to customize your experience',
    'sport.selection.confirm': 'Continue',
    'sport.selection.selected': 'Selected',
    'sport.soccer': 'Football',
    'sport.futsal': 'Futsal',
    'sport.soccer.description': 'Traditional 11v11 football management',
    'sport.futsal.description': '5v5 futsal management',
    'sport.soccer.feature1': 'Full field tactical analysis',
    'sport.soccer.feature2': 'Large squad management',
    'sport.soccer.feature3': '90-minute match tracking',
    'sport.soccer.feature4': 'Set piece analysis',
    'sport.futsal.feature1': 'Fast-paced game analysis',
    'sport.futsal.feature2': 'Rotation management',
    'sport.futsal.feature3': '40-minute match tracking',
    'sport.futsal.feature4': 'Small space tactics',

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

    // Command table (continued)
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
    'dashboard.days.ago': '{days} days ago',
    'dashboard.matches.of': '{current} of {total} matches',
    'dashboard.team.division': 'Division: {division}',
    'dashboard.team.evolution': 'Team Evolution',
    'dashboard.goals.for': 'Goals For',
    'dashboard.goals.against': 'Goals Against',
    'dashboard.top.players': 'Top 5 Players',
    'dashboard.player': 'Player',
    'dashboard.shots': 'Shots',

    // Sidebar
    'sidebar.home': 'Home',
    'sidebar.players': 'Players',
    'sidebar.trainings': 'Training',
    'sidebar.matches': 'Matches',
    'sidebar.general.stats': 'General Stats',
    'sidebar.attendance': 'Attendance',
    'sidebar.manual.actions': 'Manual Actions',
    'sidebar.command.table': 'Command Table',
    'sidebar.tactical.chat': 'Tactical Chat',
    'sidebar.advanced.analytics': 'Advanced Analytics',
    'sidebar.database.status': 'Database Status',

    // Players
    'players.title': 'Player Management',
    'players.add': 'Add Player',
    'players.back': 'Back',
    'players.goals': 'Goals',
    'players.assists': 'Assists',
    'players.games': 'Games',
    'players.minutes': 'Minutes',
    'players.position': 'Position',
    'players.performance': 'Performance',
    'players.shot.map': 'Shot Map',
    'players.general.stats': 'General Stats',
    'players.more.stats': 'View More Stats',

    // Positions
    'position.goalkeeper': 'Goalkeeper',
    'position.defender': 'Defender',
    'position.midfielder': 'Midfielder',
    'position.forward': 'Forward',

    // Matches
    'matches.title': 'Match Management',
    'matches.completed': 'Completed',
    'matches.upcoming': 'Upcoming',
    'matches.first.half': 'First Half',
    'matches.second.half': 'Second Half',

    // Stats
    'stats.title': 'General Statistics',
    'stats.performance': 'Performance',
    'stats.attack': 'Attack',
    'stats.defense': 'Defense',
    'stats.discipline': 'Discipline',
    'stats.wins': 'Wins',
    'stats.draws': 'Draws',
    'stats.losses': 'Losses',
    'stats.goals.for': 'Goals For',
    'stats.goals.against': 'Goals Against',
    'stats.assists.total': 'Total Assists',
    'stats.shots.goal': 'Shots on Goal',
    'stats.shots.out': 'Shots Off Target',
    'stats.balls.recovered': 'Balls Recovered',
    'stats.duels.won': 'Duels Won',
    'stats.saves': 'Saves',
    'stats.fouls.committed': 'Fouls Committed',
    'stats.fouls.received': 'Fouls Received',
    'stats.yellow.cards': 'Yellow Cards',
    'stats.red.cards': 'Red Cards',

    // Attendance
    'attendance.title': 'Attendance Control',
    'attendance.add.training': 'Add Training',
    'attendance.future.trainings': 'Future Training',
    'attendance.past.trainings': 'Past Training',
    'attendance.historic': 'Historic',
    'attendance.completed': 'Completed',
    'attendance.in.progress': 'In Progress',
    'attendance.pending': 'Pending',
    'attendance.present': 'Present',
    'attendance.absent': 'Absent',
    'attendance.justified': 'Justified',
    'attendance.filters': 'Filters',
    'attendance.period': 'Period',
    'attendance.all.trainings': 'All trainings',
    'attendance.last.month': 'Last month',
    'attendance.last.3.months': 'Last 3 months',
    'attendance.current.season': 'Current season',
    'attendance.all.positions': 'All positions',
    'attendance.goalkeeper': 'Goalkeeper',
    'attendance.defender': 'Defender',
    'attendance.midfielder': 'Midfielder',
    'attendance.forward': 'Forward',
    'attendance.total.players': 'Total Players',
    'attendance.average.attendance': 'Average Attendance',
    'attendance.best.attendance': 'Best Attendance',

    // Manual Actions
    'manual.actions.title': 'Manual Actions',
    'manual.actions.subtitle': 'Real-time manual statistics recording',
    'manual.actions.realtime': 'Real Time',
    'manual.actions.player': 'Player',
    'manual.actions.goals': 'Goals',
    'manual.actions.assists': 'Assists',
    'manual.actions.balls.lost': 'Balls Lost',
    'manual.actions.balls.recovered': 'Balls Recovered',
    'manual.actions.duels.won': 'Duels Won',
    'manual.actions.duels.lost': 'Duels Lost',
    'manual.actions.shots.target': 'Shots on Target',
    'manual.actions.shots.off': 'Shots Off Target',
    'manual.actions.fouls.committed': 'Fouls Committed',
    'manual.actions.fouls.received': 'Fouls Received',
    'manual.actions.saves': 'Saves',
    'manual.actions.na': 'N/A',

    // Command Table
    'command.select.player': 'Select a player first',
    'command.first.half': 'First Half',
    'command.second.half': 'Second Half',
    'command.start': 'Start',
    'command.pause': 'Pause',
    'command.restart': 'Restart',
    'command.home.team': 'CD Statsor',
    'command.away.team': 'Opponent',
    'command.actions': 'Actions',
    'command.players': 'Players',
    'command.registered.actions': 'Registered Actions',
    'command.no.actions': 'No actions registered',
    'command.edit': 'Edit',
    'command.cancel.edit': 'Cancel',
    'command.save': 'Save',
    'command.reset.default': 'Reset',
    'command.configure.actions': 'Configure Actions',
    'command.players.active.inactive': 'Active/Inactive Players',
    'command.players.on.field': 'Players on Field',

    // Actions
    'action.goal_favor': 'Goal For',
    'action.goal_against': 'Goal Against',
    'action.assist': 'Assist',
    'action.foul_favor': 'Foul For',
    'action.foul_against': 'Foul Against',
    'action.shot_goal': 'Shot on Goal',
    'action.shot_out': 'Shot Off Target',
    'action.corner_favor': 'Corner For',
    'action.corner_against': 'Corner Against',
    'action.offside': 'Offside',
    'action.penalty_favor': 'Penalty For',
    'action.penalty_against': 'Penalty Against',
    'action.double_penalty_goal': 'Double Penalty Goal',
    'action.accumulated_foul': 'Accumulated Foul',
    'action.time_out': 'Time Out',
    'action.flying_goalkeeper': 'Flying Goalkeeper',

    // Goal Location
    'goal.location.title': 'Select Goal Location',
    'goal.location.subtitle': 'Click on the zone where the goal was scored',
    'goal.location.top.left': 'Top Left',
    'goal.location.top.center': 'Top Center',
    'goal.location.top.right': 'Top Right',
    'goal.location.middle.left': 'Mid Left',
    'goal.location.middle.center': 'Mid Center',
    'goal.location.middle.right': 'Mid Right',
    'goal.location.bottom.left': 'Bot Left',
    'goal.location.bottom.center': 'Bot Center',
    'goal.location.bottom.right': 'Bot Right',
    'goal.location.goal.target': 'Goal',
    'goal.location.cancel': 'Cancel',

    // Goal Zone
    'goal.zone.title': 'Select Goal Zone',
    'goal.zone.cancel': 'Cancel',

    // Goal Origin
    'goal.origin.title': 'Goal Origin',
    'goal.origin.set.play': 'Set Play',
    'goal.origin.duality': 'Duality',
    'goal.origin.fast.transition': 'Fast Transition',
    'goal.origin.high.recovery': 'High Recovery',
    'goal.origin.individual.action': 'Individual Action',
    'goal.origin.rival.error': 'Opponent Error',
    'goal.origin.ball.loss.exit': 'Ball Loss Exit',
    'goal.origin.defensive.error': 'Defensive Error',
    'goal.origin.won.back': 'Won Back',
    'goal.origin.fast.counter': 'Fast Counter',
    'goal.origin.rival.superiority': 'Opponent Superiority',
    'goal.origin.strategy.goal': 'Strategy Goal',

    // Match Notes
    'match.notes.title': 'Match Notes',
    'match.notes.add.new': 'Add New Note',
    'match.notes.minute': 'Minute',
    'match.notes.category': 'Category',
    'match.notes.title': 'Title',
    'match.notes.content': 'Content',
    'match.notes.tactical': 'Tactical',
    'match.notes.performance': 'Performance',
    'match.notes.injury': 'Injury',
    'match.notes.general': 'General',
    'match.notes.title.placeholder': 'e.g: Effective tactical change',
    'match.notes.content.placeholder': 'Describe the observation...',
    'match.notes.add': 'Add Note',
    'match.notes.list': 'Notes List',
    'match.notes.empty': 'No notes for this match',
    'match.notes.cancel': 'Cancel',
    'match.notes.save': 'Save Notes',

    // Photo Upload
    'photo.upload.title': 'Upload Player Photo',
    'photo.upload.select': 'Select File',
    'photo.upload.selected': 'Selected file',
    'photo.upload.size': 'Size',
    'photo.upload.cancel': 'Cancel',
    'photo.upload.save': 'Save Photo',

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

    // Positions
    'position.goalkeeper': 'Goalkeeper',
    'position.defender': 'Defender',
    'position.midfielder': 'Midfielder',
    'position.forward': 'Forward',

    // Matches
    'matches.title': 'Match Management',
    'matches.completed': 'Completed',
    'matches.upcoming': 'Upcoming',
    'matches.first.half': 'First Half',
    'matches.second.half': 'Second Half',

    // Stats
    'stats.title': 'General Statistics',
    'stats.performance': 'Performance',
    'stats.attack': 'Attack',
    'stats.defense': 'Defense',
    'stats.discipline': 'Discipline',
    'stats.wins': 'Wins',
    'stats.draws': 'Draws',
    'stats.losses': 'Losses',
    'stats.goals.for': 'Goals For',
    'stats.goals.against': 'Goals Against',
    'stats.assists.total': 'Total Assists',
    'stats.shots.goal': 'Shots on Goal',
    'stats.shots.out': 'Shots Off Target',
    'stats.balls.recovered': 'Balls Recovered',
    'stats.duels.won': 'Duels Won',
    'stats.saves': 'Saves',
    'stats.fouls.committed': 'Fouls Committed',
    'stats.fouls.received': 'Fouls Received',
    'stats.yellow.cards': 'Yellow Cards',
    'stats.red.cards': 'Red Cards',

    // Attendance
    'attendance.title': 'Attendance Control',
    'attendance.add.training': 'Add Training',
    'attendance.future.trainings': 'Future Training',
    'attendance.past.trainings': 'Past Training',
    'attendance.historic': 'Historic',
    'attendance.completed': 'Completed',
    'attendance.in.progress': 'In Progress',
    'attendance.pending': 'Pending',
    'attendance.present': 'Present',
    'attendance.absent': 'Absent',
    'attendance.justified': 'Justified',
    'attendance.filters': 'Filters',
    'attendance.period': 'Period',
    'attendance.all.trainings': 'All trainings',
    'attendance.last.month': 'Last month',
    'attendance.last.3.months': 'Last 3 months',
    'attendance.current.season': 'Current season',
    'attendance.all.positions': 'All positions',
    'attendance.goalkeeper': 'Goalkeeper',
    'attendance.defender': 'Defender',
    'attendance.midfielder': 'Midfielder',
    'attendance.forward': 'Forward',
    'attendance.total.players': 'Total Players',
    'attendance.average.attendance': 'Average Attendance',
    'attendance.best.attendance': 'Best Attendance',

    // Manual Actions
    'manual.actions.title': 'Manual Actions',
    'manual.actions.subtitle': 'Real-time manual statistics recording',
    'manual.actions.realtime': 'Real Time',
    'manual.actions.player': 'Player',
    'manual.actions.goals': 'Goals',
    'manual.actions.assists': 'Assists',
    'manual.actions.balls.lost': 'Balls Lost',
    'manual.actions.balls.recovered': 'Balls Recovered',
    'manual.actions.duels.won': 'Duels Won',
    'manual.actions.duels.lost': 'Duels Lost',
    'manual.actions.shots.target': 'Shots on Target',
    'manual.actions.shots.off': 'Shots Off Target',
    'manual.actions.fouls.committed': 'Fouls Committed',
    'manual.actions.fouls.received': 'Fouls Received',
    'manual.actions.saves': 'Saves',
    'manual.actions.na': 'N/A',

    // Command Table
    'command.select.player': 'Select a player first',
    'command.first.half': 'First Half',
    'command.second.half': 'Second Half',
    'command.start': 'Start',
    'command.pause': 'Pause',
    'command.restart': 'Restart',
    'command.home.team': 'CD Statsor',
    'command.away.team': 'Opponent',
    'command.actions': 'Actions',
    'command.players': 'Players',
    'command.registered.actions': 'Registered Actions',
    'command.no.actions': 'No actions registered',
    'command.edit': 'Edit',
    'command.cancel.edit': 'Cancel',
    'command.save': 'Save',
    'command.reset.default': 'Reset',
    'command.configure.actions': 'Configure Actions',
    'command.players.active.inactive': 'Active/Inactive Players',
    'command.players.on.field': 'Players on Field',

    // Actions
    'action.goal_favor': 'Goal For',
    'action.goal_against': 'Goal Against',
    'action.assist': 'Assist',
    'action.foul_favor': 'Foul For',
    'action.foul_against': 'Foul Against',
    'action.shot_goal': 'Shot on Goal',
    'action.shot_out': 'Shot Off Target',
    'action.corner_favor': 'Corner For',
    'action.corner_against': 'Corner Against',
    'action.offside': 'Offside',
    'action.penalty_favor': 'Penalty For',
    'action.penalty_against': 'Penalty Against',
    'action.double_penalty_goal': 'Double Penalty Goal',
    'action.accumulated_foul': 'Accumulated Foul',
    'action.time_out': 'Time Out',
    'action.flying_goalkeeper': 'Flying Goalkeeper',

    // Goal Location
    'goal.location.title': 'Select Goal Location',
    'goal.location.subtitle': 'Click on the zone where the goal was scored',
    'goal.location.top.left': 'Top Left',
    'goal.location.top.center': 'Top Center',
    'goal.location.top.right': 'Top Right',
    'goal.location.middle.left': 'Mid Left',
    'goal.location.middle.center': 'Mid Center',
    'goal.location.middle.right': 'Mid Right',
    'goal.location.bottom.left': 'Bot Left',
    'goal.location.bottom.center': 'Bot Center',
    'goal.location.bottom.right': 'Bot Right',
    'goal.location.goal.target': 'Goal',
    'goal.location.cancel': 'Cancel',

    // Goal Zone
    'goal.zone.title': 'Select Goal Zone',
    'goal.zone.cancel': 'Cancel',

    // Goal Origin
    'goal.origin.title': 'Goal Origin',
    'goal.origin.set.play': 'Set Play',
    'goal.origin.duality': 'Duality',
    'goal.origin.fast.transition': 'Fast Transition',
    'goal.origin.high.recovery': 'High Recovery',
    'goal.origin.individual.action': 'Individual Action',
    'goal.origin.rival.error': 'Opponent Error',
    'goal.origin.ball.loss.exit': 'Ball Loss Exit',
    'goal.origin.defensive.error': 'Defensive Error',
    'goal.origin.won.back': 'Won Back',
    'goal.origin.fast.counter': 'Fast Counter',
    'goal.origin.rival.superiority': 'Opponent Superiority',
    'goal.origin.strategy.goal': 'Strategy Goal',

    // Match Notes
    'match.notes.title': 'Match Notes',
    'match.notes.add.new': 'Add New Note',
    'match.notes.minute': 'Minute',
    'match.notes.category': 'Category',
    'match.notes.title': 'Title',
    'match.notes.content': 'Content',
    'match.notes.tactical': 'Tactical',
    'match.notes.performance': 'Performance',
    'match.notes.injury': 'Injury',
    'match.notes.general': 'General',
    'match.notes.title.placeholder': 'e.g: Effective tactical change',
    'match.notes.content.placeholder': 'Describe the observation...',
    'match.notes.add': 'Add Note',
    'match.notes.list': 'Notes List',
    'match.notes.empty': 'No notes for this match',
    'match.notes.cancel': 'Cancel',
    'match.notes.save': 'Save Notes',

    // Photo Upload
    'photo.upload.title': 'Upload Player Photo',
    'photo.upload.select': 'Select File',
    'photo.upload.selected': 'Selected file',
    'photo.upload.size': 'Size',
    'photo.upload.cancel': 'Cancel',
    'photo.upload.save': 'Save Photo',

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

    // Format
    'format.future.title': 'The future of football is digital',
    'format.wenger.quote': 'The football of the future will be more tactical, more technical and more intelligent. Technology will help us understand the game better.',
    'format.wenger.author': '- Arsène Wenger, Former Arsenal manager',

    // General
    'general.season': 'Season',

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