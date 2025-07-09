import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { DatabaseStatus } from '@/components/DatabaseStatus';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Users, 
  BarChart3, 
  Calendar, 
  ClipboardCheck,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Check,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  ChevronDown,
  ChevronUp,
  Database,
  Activity,
  Dumbbell,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface Player {
  id: string;
  number: number;
  name: string;
  position: string;
  present: boolean;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface GameAction {
  id: string;
  type: string;
  player: string;
  minute: number;
  description: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { databaseManager, isInitialized, initializeDatabase } = useDatabase();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('command-table');
  const [gameTime, setGameTime] = useState(20 * 60); // 20 minutes in seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameActions, setGameActions] = useState<GameAction[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', number: 9, name: 'Juan Pérez', position: 'Delantero', present: true, goals: 3, assists: 2, yellowCards: 1, redCards: 0 },
    { id: '2', number: 8, name: 'Miguel Rodríguez', position: 'Centrocampista', present: true, goals: 1, assists: 4, yellowCards: 2, redCards: 0 },
    { id: '3', number: 4, name: 'Carlos López', position: 'Defensa', present: true, goals: 0, assists: 1, yellowCards: 3, redCards: 1 },
    { id: '4', number: 1, name: 'Alejandro Martínez', position: 'Portero', present: true, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    { id: '5', number: 2, name: 'David González', position: 'Defensa', present: true, goals: 1, assists: 0, yellowCards: 1, redCards: 0 },
    { id: '6', number: 7, name: 'Fernando Torres', position: 'Delantero', present: true, goals: 5, assists: 3, yellowCards: 0, redCards: 0 },
    { id: '7', number: 10, name: 'Pablo Sánchez', position: 'Centrocampista', present: true, goals: 2, assists: 6, yellowCards: 2, redCards: 0 },
    { id: '8', number: 3, name: 'Antonio Gómez', position: 'Defensa', present: true, goals: 0, assists: 2, yellowCards: 4, redCards: 0 },
    { id: '9', number: 6, name: 'Javier Ruiz', position: 'Centrocampista', present: true, goals: 1, assists: 3, yellowCards: 1, redCards: 0 },
    { id: '10', number: 5, name: 'Roberto Hernández', position: 'Defensa', present: true, goals: 0, assists: 1, yellowCards: 2, redCards: 0 },
  ]);
  
  const [newPlayerModal, setNewPlayerModal] = useState(false);
  const [editPlayerModal, setEditPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [expandedStats, setExpandedStats] = useState<string[]>([]);
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [selectedPlayerDetail, setSelectedPlayerDetail] = useState<Player | null>(null);

  // Initialize database on component mount
  useEffect(() => {
    if (!isInitialized) {
      initializeDatabase().catch(error => {
        console.error('Failed to initialize database:', error);
        toast.error('Failed to initialize database');
      });
    }
  }, [isInitialized, initializeDatabase]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && gameTime > 0) {
      interval = setInterval(() => {
        setGameTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameTime]);

  // Save players to database when they change
  useEffect(() => {
    if (databaseManager && isInitialized) {
      players.forEach(async (player) => {
        try {
          await databaseManager.update('players', player.id, player);
        } catch (error) {
          console.error('Failed to save player:', error);
        }
      });
    }
  }, [players, databaseManager, isInitialized]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const togglePlayerAttendance = async (playerId: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, present: !player.present }
        : player
    ));
    
    if (databaseManager) {
      try {
        const player = players.find(p => p.id === playerId);
        if (player) {
          await databaseManager.update('players', playerId, { 
            ...player, 
            present: !player.present 
          });
        }
      } catch (error) {
        console.error('Failed to update attendance:', error);
      }
    }
    
    toast.success('Attendance updated');
  };

  const addGameAction = async (actionType: string) => {
    const newAction: GameAction = {
      id: Date.now().toString(),
      type: actionType,
      player: 'Unknown',
      minute: Math.floor((20 * 60 - gameTime) / 60),
      description: `${actionType} recorded`
    };
    
    setGameActions(prev => [...prev, newAction]);
    
    if (databaseManager) {
      try {
        await databaseManager.create('match_events', {
          type: actionType,
          player_id: 'unknown',
          team_id: 'current_team',
          minute: newAction.minute,
          description: newAction.description,
          metadata: {}
        });
      } catch (error) {
        console.error('Failed to save game action:', error);
      }
    }
    
    toast.success(`${actionType} recorded`);
  };

  const addNewPlayer = async (playerData: Partial<Player>) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      number: playerData.number || players.length + 1,
      name: playerData.name || '',
      position: playerData.position || 'Delantero',
      present: true,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      ...playerData
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    
    if (databaseManager) {
      try {
        await databaseManager.createPlayer({
          name: newPlayer.name,
          number: newPlayer.number,
          position: newPlayer.position as any,
          team_id: 'current_team',
          birth_date: '2000-01-01',
          statistics: {
            goals: newPlayer.goals,
            assists: newPlayer.assists,
            yellow_cards: newPlayer.yellowCards,
            red_cards: newPlayer.redCards,
            minutes_played: 0,
            matches_played: 0,
            passes_completed: 0,
            passes_attempted: 0,
            shots_on_target: 0,
            shots_total: 0
          },
          attendance: [],
          medical_info: {
            injuries: [],
            medical_clearance: true,
            emergency_contact: {
              name: '',
              phone: '',
              relationship: ''
            }
          }
        });
      } catch (error) {
        console.error('Failed to save new player:', error);
      }
    }
    
    setNewPlayerModal(false);
    toast.success('Player added successfully');
  };

  const updatePlayer = async (playerData: Partial<Player>) => {
    if (!selectedPlayer) return;
    
    setPlayers(prev => prev.map(player => 
      player.id === selectedPlayer.id 
        ? { ...player, ...playerData }
        : player
    ));
    
    if (databaseManager) {
      try {
        await databaseManager.update('players', selectedPlayer.id, playerData);
      } catch (error) {
        console.error('Failed to update player:', error);
      }
    }
    
    setEditPlayerModal(false);
    setSelectedPlayer(null);
    toast.success('Player updated successfully');
  };

  const deletePlayer = async (playerId: string) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
    
    if (databaseManager) {
      try {
        await databaseManager.delete('players', playerId);
      } catch (error) {
        console.error('Failed to delete player:', error);
      }
    }
    
    toast.success('Player deleted');
  };

  const toggleStatExpansion = (statType: string) => {
    setExpandedStats(prev => 
      prev.includes(statType) 
        ? prev.filter(s => s !== statType)
        : [...prev, statType]
    );
  };

  const handleDragStart = (player: Player) => {
    setDraggedPlayer(player);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPosition: string) => {
    e.preventDefault();
    if (draggedPlayer) {
      updatePlayer({ position: targetPosition });
      setDraggedPlayer(null);
      toast.success(`${draggedPlayer.name} moved to ${targetPosition}`);
    }
  };

  const sidebarItems = [
    { id: 'command-table', icon: Home, label: t('dashboard.command.table') },
    { id: 'action-register', icon: FileText, label: t('dashboard.action.register') },
    { id: 'players', icon: Users, label: t('dashboard.players') },
    { id: 'training', icon: Dumbbell, label: 'Entrenamientos' },
    { id: 'attendance', icon: ClipboardCheck, label: t('dashboard.attendance') },
    { id: 'statistics', icon: BarChart3, label: t('dashboard.statistics') },
    { id: 'analytics', icon: Activity, label: 'Advanced Analytics' },
    { id: 'database', icon: Database, label: 'Database Status' },
  ];

  const actions = [
    { name: 'FALTA CONTRA', color: 'bg-red-500 hover:bg-red-600 transform hover:scale-105 transition-all duration-200' },
    { name: 'FALTA FAVOR', color: 'bg-green-500 hover:bg-green-600 transform hover:scale-105 transition-all duration-200' },
    { name: 'PENALTI FAVOR', color: 'bg-blue-500 hover:bg-blue-600 transform hover:scale-105 transition-all duration-200' },
    { name: 'PENALTI CONTRA', color: 'bg-orange-500 hover:bg-orange-600 transform hover:scale-105 transition-all duration-200' },
    { name: 'BALÓN PERDIDO', color: 'bg-lime-500 hover:bg-lime-600 transform hover:scale-105 transition-all duration-200' },
    { name: 'BALÓN RECUPERADO', color: 'bg-gray-500 hover:bg-gray-600 transform hover:scale-105 transition-all duration-200' },
    { name: 'DUELO GANADO', color: 'bg-pink-500 hover:bg-pink-600 transform hover:scale-105 transition-all duration-200' },
    { name: 'DUELO PERDIDO', color: 'bg-black hover:bg-gray-800 transform hover:scale-105 transition-all duration-200' },
    { name: 'GOL FAVOR', color: 'bg-red-400 hover:bg-red-500 transform hover:scale-105 transition-all duration-200' },
    { name: 'GOL CONTRA', color: 'bg-red-700 hover:bg-red-800 transform hover:scale-105 transition-all duration-200' },
    { name: 'ASISTENCIA', color: 'bg-yellow-400 hover:bg-yellow-500 transform hover:scale-105 transition-all duration-200' },
    { name: 'PARADA', color: 'bg-cyan-400 hover:bg-cyan-500 transform hover:scale-105 transition-all duration-200' },
    { name: 'TIRO PUERTA', color: 'bg-purple-500 hover:bg-purple-600 transform hover:scale-105 transition-all duration-200' },
    { name: 'TIRO FUERA', color: 'bg-green-400 hover:bg-green-500 transform hover:scale-105 transition-all duration-200' },
    { name: 'CORNER FAVOR', color: 'bg-blue-400 hover:bg-blue-500 transform hover:scale-105 transition-all duration-200' },
    { name: 'CORNER CONTRA', color: 'bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-all duration-200' },
  ];

  const renderCommandTable = () => (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('dashboard.command.table')}</h2>
        <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors">
          <Maximize className="w-4 h-4 mr-2" />
          {t('dashboard.full.screen')}
        </Button>
      </div>

      {/* Game Timer with enhanced styling */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6 border shadow-lg">
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
            </div>
            <p className="font-semibold">CD Statsor</p>
            <div className="flex space-x-1 mt-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold mb-2 font-mono text-gray-800">{formatTime(gameTime)}</div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} transform hover:scale-105 transition-all`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? t('dashboard.pause') : t('dashboard.start')}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="hover:bg-gray-100 transform hover:scale-105 transition-all"
                onClick={() => setGameTime(20 * 60)}
              >
                <RotateCcw className="w-4 h-4" />
                {t('dashboard.restart')}
              </Button>
            </div>
          </div>

          <div className="text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 bg-yellow-600 rounded"></div>
            </div>
            <p className="font-semibold">Equipo</p>
            <div className="flex space-x-1 mt-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions with hover effects */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.actions')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                className={`${action.color} text-white text-xs p-3 h-auto shadow-md`}
                variant="default"
                onClick={() => addGameAction(action.name)}
              >
                {action.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Players with drag and drop */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.players')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {players.slice(0, 12).map((player, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(player)}
                className="bg-green-500 text-white p-3 rounded flex items-center space-x-2 cursor-move hover:bg-green-600 transform hover:scale-105 transition-all shadow-md hover:shadow-lg"
              >
                <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {player.number}
                </span>
                <span className="font-semibold">{player.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <Button className="bg-blue-500 hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg">
          <FileText className="w-4 h-4 mr-2" />
          {t('dashboard.go.to.goals')}
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600 transform hover:scale-105 transition-all shadow-lg"
          onClick={() => toast.success('Statistics saved!')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          {t('dashboard.save.stats')}
        </Button>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <Button variant="outline" className="hover:bg-gray-100 transform hover:scale-105 transition-all">
          Primera Parte
        </Button>
        <Button variant="outline" className="hover:bg-gray-100 transform hover:scale-105 transition-all">
          Segunda Parte
        </Button>
      </div>
    </div>
  );

  const renderActionRegister = () => (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('dashboard.action.register')}</h2>
        <div className="flex space-x-2">
          <Button className="bg-blue-500 hover:bg-blue-600 transform hover:scale-105 transition-all">
            Ir a Registro de Goles
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 transform hover:scale-105 transition-all">
            <Download className="w-4 h-4 mr-2" />
            Guardar Estadísticas
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-semibold">Tabla de Registro de Acciones</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Jugador</th>
                <th className="px-4 py-3 text-left">Goles</th>
                <th className="px-4 py-3 text-left">Asistencias</th>
                <th className="px-4 py-3 text-left">Balones perdidos</th>
                <th className="px-4 py-3 text-left">Balones Recuperados</th>
                <th className="px-4 py-3 text-left">Duelos Ganados</th>
                <th className="px-4 py-3 text-left">Duelos perdidos</th>
                <th className="px-4 py-3 text-left">Tiros a Portería</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr 
                  key={index} 
                  className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedPlayerDetail(player)}
                >
                  <td className="px-4 py-3 font-medium hover:text-blue-600">{player.name}</td>
                  <td className="px-4 py-3">{player.goals}</td>
                  <td className="px-4 py-3">{player.assists}</td>
                  <td className="px-4 py-3">{Math.floor(Math.random() * 5)}</td>
                  <td className="px-4 py-3">{Math.floor(Math.random() * 8)}</td>
                  <td className="px-4 py-3">{Math.floor(Math.random() * 6)}</td>
                  <td className="px-4 py-3">{Math.floor(Math.random() * 3)}</td>
                  <td className="px-4 py-3">{Math.floor(Math.random() * 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{t('dashboard.attendance.control')}</h2>
        <p className="text-gray-600">{t('dashboard.attendance.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('dashboard.total.players')}
          </h3>
          <p className="text-3xl font-bold text-gray-900">{players.length}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow border border-green-200 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('dashboard.present')}
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {players.filter(p => p.present).length}
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('dashboard.absent')}
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {players.filter(p => !p.present).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{t('dashboard.player.list')}</h3>
          <p className="text-sm text-gray-600">{t('dashboard.attendance.instruction')}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transform hover:scale-105 transition-all ${
                  player.present 
                    ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                    : 'bg-red-50 border-red-200 hover:bg-red-100'
                }`}
                onClick={() => togglePlayerAttendance(player.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {player.number}. {player.name}
                    </div>
                    <div className="text-sm text-gray-600">{player.position}</div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    player.present ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  }`}>
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlayers = () => (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('dashboard.players')}</h2>
        <div className="flex items-center space-x-4">
          <select className="border rounded px-3 py-2 hover:border-blue-500 transition-colors">
            <option>{t('dashboard.no.order')}</option>
            <option>Por posición</option>
            <option>Por número</option>
            <option>Por nombre</option>
          </select>
          <Dialog open={newPlayerModal} onOpenChange={setNewPlayerModal}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 transform hover:scale-105 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                {t('dashboard.add.player')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Jugador</DialogTitle>
              </DialogHeader>
              <PlayerForm onSubmit={addNewPlayer} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {players.map((player, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded-lg shadow border flex items-center space-x-4 hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {player.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{player.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  #{player.number}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {player.goals} goles
                </span>
                <span className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  {player.assists} asistencias
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500 block">{player.position}</span>
              <div className="flex space-x-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedPlayer(player);
                    setEditPlayerModal(true);
                  }}
                  className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deletePlayer(player.id)}
                  className="hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Player Modal */}
      <Dialog open={editPlayerModal} onOpenChange={setEditPlayerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Jugador</DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <PlayerForm 
              initialData={selectedPlayer} 
              onSubmit={updatePlayer} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderStatistics = () => (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t('dashboard.stats.title')}</h2>
          <p className="text-gray-600">{t('dashboard.stats.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <select className="border rounded px-3 py-2 hover:border-blue-500 transition-colors">
            <option>Temporada 2023/24</option>
            <option>Temporada 2022/23</option>
          </select>
          <Button variant="outline" className="hover:bg-gray-100 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'performance', title: t('dashboard.performance'), icon: BarChart3, color: 'purple' },
          { key: 'attack', title: t('dashboard.attack'), icon: Users, color: 'green' },
          { key: 'defense', title: t('dashboard.defense'), icon: Users, color: 'blue' },
          { key: 'discipline', title: t('dashboard.discipline'), icon: Users, color: 'red' }
        ].map((stat) => (
          <div key={stat.key} className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleStatExpansion(stat.key)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <span className="font-semibold">{stat.title}</span>
              </div>
              <div className="text-gray-400">
                {expandedStats.includes(stat.key) ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>
            
            {expandedStats.includes(stat.key) && (
              <div className="mt-4 pt-4 border-t animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {stat.key === 'performance' ? '85%' : 
                       stat.key === 'attack' ? '23' :
                       stat.key === 'defense' ? '12' : '8'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.key === 'performance' ? 'Efectividad' : 
                       stat.key === 'attack' ? 'Goles' :
                       stat.key === 'defense' ? 'Intercepciones' : 'Tarjetas'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {stat.key === 'performance' ? '92%' : 
                       stat.key === 'attack' ? '15' :
                       stat.key === 'defense' ? '28' : '3'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.key === 'performance' ? 'Precisión' : 
                       stat.key === 'attack' ? 'Asistencias' :
                       stat.key === 'defense' ? 'Despejes' : 'Expulsiones'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">
                      {stat.key === 'performance' ? '78%' : 
                       stat.key === 'attack' ? '67%' :
                       stat.key === 'defense' ? '89%' : '95%'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.key === 'performance' ? 'Consistencia' : 
                       stat.key === 'attack' ? 'Conversión' :
                       stat.key === 'defense' ? 'Éxito' : 'Fair Play'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="animate-fadeIn">
      <AnalyticsDashboard />
    </div>
  );

  const renderDatabaseStatus = () => (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Database Status</h2>
        <p className="text-gray-600">Monitor and manage your multi-database system</p>
      </div>
      <DatabaseStatus />
    </div>
  );

  const renderPlayerDetail = () => {
    if (!selectedPlayerDetail) return null;
    
    return (
      <div className="p-6 animate-fadeIn">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedPlayerDetail(null)}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-2xl font-bold">Detalle del Jugador</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedPlayerDetail.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedPlayerDetail.name}</h3>
                  <p className="text-gray-600">{selectedPlayerDetail.position}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-semibold ${selectedPlayerDetail.present ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedPlayerDetail.present ? 'Presente' : 'Ausente'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Partidos jugados:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minutos jugados:</span>
                  <span className="font-semibold">1,080</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Estadísticas Detalladas</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedPlayerDetail.goals}</div>
                  <div className="text-sm text-gray-600">Goles</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedPlayerDetail.assists}</div>
                  <div className="text-sm text-gray-600">Asistencias</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{selectedPlayerDetail.yellowCards}</div>
                  <div className="text-sm text-gray-600">T. Amarillas</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{selectedPlayerDetail.redCards}</div>
                  <div className="text-sm text-gray-600">T. Rojas</div>
                </div>
              </div>

              {/* Additional stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-3">Acciones Ofensivas</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tiros a portería:</span>
                      <span className="font-semibold">{Math.floor(Math.random() * 15) + 5}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiros a puerta:</span>
                      <span className="font-semibold">{Math.floor(Math.random() * 8) + 2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pases clave:</span>
                      <span className="font-semibold">{Math.floor(Math.random() * 20) + 5}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3">Acciones Defensivas</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Balones recuperados:</span>
                      <span className="font-semibold">{Math.floor(Math.random() * 25) + 10}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duelos ganados:</span>
                      <span className="font-semibold">{Math.floor(Math.random() * 30) + 15}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intercepciones:</span>
                      <span className="font-semibold">{Math.floor(Math.random() * 20) + 8}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance chart placeholder */}
              <div className="mt-6">
                <h5 className="font-semibold mb-3">Rendimiento por Partido</h5>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Gráfico de rendimiento (próximamente)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTraining = () => {
    const [sessionName, setSessionName] = useState('Nueva Sesión de Entrenamiento');
    const [selectedExercises, setSelectedExercises] = useState<{[key: string]: any[]}>({
      activacion: [],
      juego: [],
      analitica: [],
      situacional: [],
      final: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('todos');
    const [sessionDate, setSessionDate] = useState<Date>();
    
    const phases = [
      { id: 'activacion', name: 'Activación', color: 'bg-green-500', maxDuration: 15 },
      { id: 'juego', name: 'Juego', color: 'bg-blue-500', maxDuration: 30 },
      { id: 'analitica', name: 'Analítica', color: 'bg-purple-500', maxDuration: 20 },
      { id: 'situacional', name: 'Situacional', color: 'bg-orange-500', maxDuration: 25 },
      { id: 'final', name: 'Final', color: 'bg-red-500', maxDuration: 10 }
    ];

    const exerciseLibrary = [
      {
        id: 1,
        name: 'Pase y seguimiento',
        category: 'ataque',
        type: 'tecnico',
        duration: 15,
        players: '10-15',
        description: 'Ejercicio de precisión en el pase',
        objective: 'Mejorar la precisión del pase corto'
      },
      {
        id: 2,
        name: 'Defensa en línea',
        category: 'defensa',
        type: 'tactico',
        duration: 20,
        players: '8-11',
        description: 'Mantener línea defensiva',
        objective: 'Coordinar movimientos defensivos'
      },
      {
        id: 3,
        name: 'Transición rápida',
        category: 'transicion',
        type: 'fisico',
        duration: 18,
        players: '6-8',
        description: 'Cambio rápido de defensa a ataque',
        objective: 'Mejorar velocidad de transición'
      },
      {
        id: 4,
        name: 'Rondo 4 vs 2',
        category: 'posesion',
        type: 'tactico',
        duration: 12,
        players: '6',
        description: 'Conservación del balón en espacio reducido',
        objective: 'Mantener posesión bajo presión'
      },
      {
        id: 5,
        name: 'Finalización',
        category: 'ataque',
        type: 'tecnico',
        duration: 25,
        players: '8-12',
        description: 'Ejercicios de definición',
        objective: 'Mejorar efectividad en área'
      },
      {
        id: 6,
        name: 'Pressing coordinado',
        category: 'defensa',
        type: 'tactico',
        duration: 22,
        players: '11',
        description: 'Presión alta organizada',
        objective: 'Recuperar balón en campo rival'
      }
    ];

    const filters = [
      { id: 'todos', name: 'Todos' },
      { id: 'ataque', name: 'Ataque' },
      { id: 'defensa', name: 'Defensa' },
      { id: 'transicion', name: 'Transición' },
      { id: 'posesion', name: 'Posesión' },
      { id: 'estrategia', name: 'Estrategia' }
    ];

    const filteredExercises = exerciseLibrary.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'todos' || exercise.category === activeFilter;
      return matchesSearch && matchesFilter;
    });

    const totalDuration = Object.values(selectedExercises).flat().reduce((total: number, exercise: any) => total + exercise.duration, 0);

    const handleDragStart = (e: React.DragEvent, exercise: any) => {
      e.dataTransfer.setData('application/json', JSON.stringify(exercise));
    };

    const handleDrop = (e: React.DragEvent, phaseId: string) => {
      e.preventDefault();
      const exercise = JSON.parse(e.dataTransfer.getData('application/json'));
      setSelectedExercises(prev => ({
        ...prev,
        [phaseId]: [...prev[phaseId], { ...exercise, id: `${exercise.id}-${Date.now()}` }]
      }));
      toast.success(`Ejercicio añadido a ${phases.find(p => p.id === phaseId)?.name}`);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const removeExercise = (phaseId: string, exerciseId: string) => {
      setSelectedExercises(prev => ({
        ...prev,
        [phaseId]: prev[phaseId].filter(ex => ex.id !== exerciseId)
      }));
    };

    const saveTraining = () => {
      toast.success('Entrenamiento guardado correctamente');
    };

    return (
      <div className="p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Input
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="text-xl font-bold bg-transparent border-none focus:ring-0 p-0"
            />
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{sessionDate ? format(sessionDate, 'dd/MM/yyyy') : 'Seleccionar fecha'}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={saveTraining}>
              <Download className="w-4 h-4 mr-2" />
              Guardar entrenamiento
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Ver entrenamiento
            </Button>
          </div>
        </div>

        {/* Duration counter */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Duración total: {totalDuration} minutos</span>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm text-gray-600">Jugadores presentes: 20</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all" 
              style={{ width: `${Math.min((totalDuration / 90) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Training phases */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 min-h-48"
              onDrop={(e) => handleDrop(e, phase.id)}
              onDragOver={handleDragOver}
            >
              <div className={`${phase.color} text-white p-3 rounded-t-lg`}>
                <h3 className="font-semibold text-center">{phase.name}</h3>
                <div className="text-xs text-center opacity-80">
                  {selectedExercises[phase.id].reduce((total, ex) => total + ex.duration, 0)}/{phase.maxDuration} min
                </div>
              </div>
              <div className="p-3 space-y-2">
                {selectedExercises[phase.id].map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-gray-50 rounded p-2 text-sm border hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-xs text-gray-600">{exercise.duration} min</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeExercise(phase.id, exercise.id)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {selectedExercises[phase.id].length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8">
                    Arrastra ejercicios aquí
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Exercise library */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Librería de Ejercicios</h3>
              <div className="text-sm text-gray-600">{filteredExercises.length} ejercicios encontrados</div>
            </div>
            
            {/* Search and filters */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar ejercicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex space-x-2">
                {filters.map((filter) => (
                  <Button
                    key={filter.id}
                    size="sm"
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, exercise)}
                  className="bg-white border rounded-lg p-4 cursor-grab hover:shadow-md transition-all hover:scale-105 active:cursor-grabbing"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      exercise.category === 'ataque' ? 'bg-green-100 text-green-800' :
                      exercise.category === 'defensa' ? 'bg-red-100 text-red-800' :
                      exercise.category === 'transicion' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {exercise.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{exercise.duration} min</span>
                    <span>{exercise.players} jugadores</span>
                    <span className="capitalize">{exercise.type}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-700 italic">
                    {exercise.objective}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedPlayerDetail) {
      return renderPlayerDetail();
    }
    
    switch (activeTab) {
      case 'command-table':
        return renderCommandTable();
      case 'action-register':
        return renderActionRegister();
      case 'attendance':
        return renderAttendance();
      case 'players':
        return renderPlayers();
      case 'training':
        return renderTraining();
      case 'statistics':
        return renderStatistics();
      case 'analytics':
        return renderAnalytics();
      case 'database':
        return renderDatabaseStatus();
      default:
        return renderCommandTable();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/01b5bf86-f2e7-42cd-9465-4d0bb347d2ea.png" 
              alt="Statsor" 
              className="h-8 w-auto"
            />
            <span className="font-bold">Statsor</span>
          </div>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all transform hover:scale-105 ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {t('dashboard.welcome')}
            </h1>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="text-sm text-gray-700">{user?.email}</span>
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                size="sm"
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Player Form Component
const PlayerForm: React.FC<{
  initialData?: Partial<Player>;
  onSubmit: (data: Partial<Player>) => void;
}> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    number: initialData?.number || 0,
    position: initialData?.position || 'Delantero',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Número</label>
        <Input
          type="number"
          value={formData.number}
          onChange={(e) => setFormData(prev => ({ ...prev, number: parseInt(e.target.value) }))}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Posición</label>
        <select
          value={formData.position}
          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Portero">Portero</option>
          <option value="Defensa">Defensa</option>
          <option value="Centrocampista">Centrocampista</option>
          <option value="Delantero">Delantero</option>
        </select>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar' : 'Añadir'} Jugador
      </Button>
    </form>
  );
};

export default Dashboard;