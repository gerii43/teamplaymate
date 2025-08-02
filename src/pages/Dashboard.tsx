import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Plus, 
  Settings, 
  Crown,
  BarChart3,
  Target,
  Activity,
  Star,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { subscriptionService } from '@/services/subscriptionService';
import PlayerManagement from '@/components/PlayerManagement';
import TacticalChat from '@/components/TacticalChat';

interface Team {
  id: string;
  name: string;
  players: number;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: 'scheduled' | 'live' | 'completed';
}

const Dashboard: React.FC = () => {
  console.log('Dashboard component rendering...');
  const { user } = useAuth();
  const { language } = useLanguage();
  const { theme } = useTheme();
  
  console.log('User:', user);
  console.log('Language:', language);
  console.log('Theme:', theme);
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [subscriptionSummary, setSubscriptionSummary] = useState<any>(null);

  const canCreateTeam = () => {
    if (!user?.email) return false;
    return subscriptionService.canCreateResource(user.email, 'teams');
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load from localStorage
        const savedTeams = localStorage.getItem('statsor_teams');
        const savedMatches = localStorage.getItem('statsor_matches');
        
        if (savedTeams) {
          setTeams(JSON.parse(savedTeams));
        } else {
          // Start with empty teams
          setTeams([]);
        }

        if (savedMatches) {
          setMatches(JSON.parse(savedMatches));
        } else {
          // Start with empty matches
          setMatches([]);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    if (user?.email) {
      const summary = subscriptionService.getSubscriptionSummary(user.email);
      setSubscriptionSummary(summary);
    }
  }, [user]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error(language === 'en' ? 'Please enter a team name' : 'Por favor ingresa un nombre de equipo');
      return;
    }

    if (!canCreateTeam()) {
      toast.error(language === 'en' ? 'You have reached the maximum number of teams for your plan' : 'Has alcanzado el número máximo de equipos para tu plan');
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      players: 0,
      matches: 0,
      wins: 0,
      losses: 0,
      draws: 0
    };
    
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem('statsor_teams', JSON.stringify(updatedTeams));
    localStorage.setItem('statsor_team_count', updatedTeams.length.toString());

    // Update usage stats
    if (user?.email) {
      subscriptionService.updateUsageStats(user.email, {
        teamsCreated: updatedTeams.length
      });
    }
    
    setNewTeamName('');
    setShowCreateTeam(false);
    toast.success(language === 'en' ? 'Team created successfully!' : '¡Equipo creado exitosamente!');
  };

  const getTotalStats = () => {
    return teams.reduce((acc, team) => ({
      players: acc.players + team.players,
      matches: acc.matches + team.matches,
      wins: acc.wins + team.wins,
      losses: acc.losses + team.losses,
      draws: acc.draws + team.draws
    }), { players: 0, matches: 0, wins: 0, losses: 0, draws: 0 });
  };

  const getWinRate = () => {
    const stats = getTotalStats();
    const totalMatches = stats.wins + stats.losses + stats.draws;
    return totalMatches > 0 ? Math.round((stats.wins / totalMatches) * 100) : 0;
  };

  const upcomingMatches = matches.filter(match => match.status === 'scheduled').slice(0, 3);
  const recentMatches = matches.filter(match => match.status === 'completed').slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Add error boundary for user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Authentication Required' : 'Autenticación Requerida'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'en' ? 'Please sign in to access the dashboard.' : 'Por favor inicia sesión para acceder al panel.'}
          </p>
          <Link to="/signin">
            <Button className="bg-green-600 hover:bg-green-700">
              {language === 'en' ? 'Sign In' : 'Iniciar Sesión'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log('Dashboard render starting...');
  
  return (
      <div className={`min-h-screen p-6 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {language === 'en' ? 'Welcome back' : 'Bienvenido de vuelta'}, {user?.name}!
                </h1>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'en' 
                    ? 'Here\'s what\'s happening with your teams today'
                    : 'Aquí está lo que está pasando con tus equipos hoy'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {subscriptionSummary?.plan && (
                  <Badge className={`${
                    subscriptionSummary.plan.id === 'pro' || subscriptionSummary.plan.id === 'enterprise'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    <Crown className="w-4 h-4 mr-1" />
                    {subscriptionSummary.plan.name}
                  </Badge>
                )}
                <Button onClick={() => setShowCreateTeam(true)} disabled={!canCreateTeam()}>
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Add Team' : 'Agregar Equipo'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Subscription Status Banner */}
          {subscriptionSummary && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg border ${
                subscriptionSummary.isInTrial 
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">
                      {subscriptionSummary.isInTrial 
                        ? (language === 'en' ? 'Free Trial Active' : 'Prueba Gratuita Activa')
                        : (language === 'en' ? 'Subscription Active' : 'Suscripción Activa')
                      }
                    </h3>
                    <p className="text-sm opacity-80">
                      {subscriptionSummary.isInTrial 
                        ? (language === 'en' 
                            ? `${subscriptionSummary.trialDaysRemaining} days remaining in trial`
                            : `${subscriptionSummary.trialDaysRemaining} días restantes en la prueba`
                          )
                        : (language === 'en' 
                            ? `Current plan: ${subscriptionSummary.plan?.name}`
                            : `Plan actual: ${subscriptionSummary.plan?.name}`
                          )
                      }
                    </p>
                  </div>
                </div>
                {subscriptionSummary.isInTrial && (
                  <Link to="/pricing">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      {language === 'en' ? 'Upgrade Now' : 'Actualizar Ahora'}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: language === 'en' ? 'Total Teams' : 'Total Equipos',
                value: teams.length,
                icon: Users,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
              },
              {
                title: language === 'en' ? 'Total Players' : 'Total Jugadores',
                value: getTotalStats().players,
                icon: Users,
                color: 'text-green-600',
                bgColor: 'bg-green-100'
              },
              {
                title: language === 'en' ? 'Win Rate' : 'Porcentaje de Victoria',
                value: `${getWinRate()}%`,
                icon: Trophy,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100'
              },
              {
                title: language === 'en' ? 'Total Matches' : 'Total Partidos',
                value: getTotalStats().matches,
                icon: Calendar,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Teams Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{language === 'en' ? 'Your Teams' : 'Tus Equipos'}</span>
                    <Link to="/teams">
                      <Button variant="outline" size="sm">
                        {language === 'en' ? 'View All' : 'Ver Todos'}
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teams.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className={`text-lg ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {language === 'en' ? 'No teams yet' : 'Aún no hay equipos'}
                      </p>
                      <Button onClick={() => setShowCreateTeam(true)} className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Create Your First Team' : 'Crear tu Primer Equipo'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className={`p-4 rounded-lg border ${
                            theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">{team.name}</h3>
                            <Badge variant="outline">
                              {team.players} {language === 'en' ? 'players' : 'jugadores'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-semibold text-green-600">{team.wins}</p>
                              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {language === 'en' ? 'Wins' : 'Victorias'}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-red-600">{team.losses}</p>
                              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {language === 'en' ? 'Losses' : 'Derrotas'}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-yellow-600">{team.draws}</p>
                              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {language === 'en' ? 'Draws' : 'Empates'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Progress 
                              value={team.matches > 0 ? (team.wins / team.matches) * 100 : 0} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Subscription Status */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Subscription' : 'Suscripción'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {language === 'en' ? 'Current Plan' : 'Plan Actual'}
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        {subscriptionSummary?.plan?.name || 'Free'}
                      </Badge>
                    </div>
                    {subscriptionSummary?.subscription && (
                      <div className="flex justify-between items-center">
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                          {language === 'en' ? 'Status' : 'Estado'}
                        </span>
                        <Badge className={
                          subscriptionSummary.subscription.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }>
                          {subscriptionSummary.subscription.status}
                        </Badge>
                      </div>
                    )}
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/pricing">
                        {language === 'en' ? 'Manage Subscription' : 'Gestionar Suscripción'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Quick Actions' : 'Acciones Rápidas'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/matches">
                        <Calendar className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Schedule Match' : 'Programar Partido'}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/players">
                        <Users className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Add Player' : 'Agregar Jugador'}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/analytics">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'View Analytics' : 'Ver Analíticas'}
                      </Link>
                    </Button>
                    {subscriptionSummary?.canAccessAdvancedFeatures && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/tactical-chat">
                          <Target className="w-4 h-4 mr-2" />
                          {language === 'en' ? 'AI Assistant' : 'Asistente IA'}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Recent Activity' : 'Actividad Reciente'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentMatches.slice(0, 3).map((match) => (
                      <div key={match.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          match.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {match.homeTeam} vs {match.awayTeam}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(match.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {match.homeScore}-{match.awayScore}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Player Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <PlayerManagement 
              teamId={teams[0]?.id} 
              onPlayersChange={(players) => {
                // Update usage stats when players are added
                if (user?.email) {
                  subscriptionService.updateUsageStats(user.email, {
                    playersAdded: players.length
                  });
                }
              }}
            />
          </motion.div>

          {/* Tactical Chat Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <TacticalChat 
              userId={user?.email || ''}
              teamId={teams[0]?.id}
            />
          </motion.div>

          {/* Create Team Modal */}
          {showCreateTeam && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`max-w-md w-full p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <h3 className="text-xl font-bold mb-4">
                  {language === 'en' ? 'Create New Team' : 'Crear Nuevo Equipo'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'Team Name' : 'Nombre del Equipo'}
                    </label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className={`w-full p-3 border rounded-lg ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={language === 'en' ? 'Enter team name' : 'Ingresa el nombre del equipo'}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateTeam(false)}
                      className="flex-1"
                    >
                      {language === 'en' ? 'Cancel' : 'Cancelar'}
                    </Button>
                    <Button
                      onClick={handleCreateTeam}
                      className="flex-1"
                    >
                      {language === 'en' ? 'Create Team' : 'Crear Equipo'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
};

export default Dashboard;