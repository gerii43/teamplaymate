import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
  Check
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('command-table');
  const [gameTime, setGameTime] = useState('20:00');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const sidebarItems = [
    { id: 'command-table', icon: Home, label: t('dashboard.command.table') },
    { id: 'action-register', icon: FileText, label: t('dashboard.action.register') },
    { id: 'players', icon: Users, label: t('dashboard.players') },
    { id: 'attendance', icon: ClipboardCheck, label: t('dashboard.attendance') },
    { id: 'statistics', icon: BarChart3, label: t('dashboard.statistics') },
  ];

  const actions = [
    { name: 'FALTA CONTRA', color: 'bg-red-500' },
    { name: 'FALTA FAVOR', color: 'bg-green-500' },
    { name: 'PENALTI FAVOR', color: 'bg-blue-500' },
    { name: 'PENALTI CONTRA', color: 'bg-orange-500' },
    { name: 'BALÓN PERDIDO', color: 'bg-lime-500' },
    { name: 'BALÓN RECUPERADO', color: 'bg-gray-500' },
    { name: 'DUELO GANADO', color: 'bg-pink-500' },
    { name: 'DUELO PERDIDO', color: 'bg-black' },
    { name: 'GOL FAVOR', color: 'bg-red-400' },
    { name: 'GOL CONTRA', color: 'bg-red-700' },
    { name: 'ASISTENCIA', color: 'bg-yellow-400' },
    { name: 'PARADA', color: 'bg-cyan-400' },
    { name: 'TIRO PUERTA', color: 'bg-purple-500' },
    { name: 'TIRO FUERA', color: 'bg-green-400' },
    { name: 'CORNER FAVOR', color: 'bg-blue-400' },
    { name: 'CORNER CONTRA', color: 'bg-red-600' },
  ];

  const players = [
    { number: 12, name: 'JUAN', color: 'bg-green-500' },
    { number: 9, name: 'PABLO', color: 'bg-green-500' },
    { number: 4, name: 'IZAN', color: 'bg-green-500' },
    { number: 8, name: 'JORDI', color: 'bg-green-500' },
    { number: 15, name: 'NIL', color: 'bg-green-500' },
    { number: 2, name: 'MATEO', color: 'bg-green-500' },
    { number: 15, name: 'ADRIÁN', color: 'bg-green-500' },
    { number: 43, name: 'JULIO', color: 'bg-green-500' },
    { number: 67, name: 'ROBERTO', color: 'bg-green-500' },
    { number: 91, name: 'LUÍS', color: 'bg-green-500' },
    { number: 23, name: 'POL', color: 'bg-green-500' },
    { number: 90, name: 'ROGER', color: 'bg-green-500' },
  ];

  const attendancePlayers = [
    { number: 9, name: 'Juan Pérez', position: 'Delantero', present: true },
    { number: 8, name: 'Miguel Rodríguez', position: 'Centrocampista', present: true },
    { number: 4, name: 'Carlos López', position: 'Defensa', present: true },
    { number: 1, name: 'Alejandro Martínez', position: 'Portero', present: true },
    { number: 2, name: 'David González', position: 'Defensa', present: true },
    { number: 7, name: 'Fernando Torres', position: 'Delantero', present: true },
    { number: 10, name: 'Pablo Sánchez', position: 'Centrocampista', present: true },
    { number: 3, name: 'Antonio Gómez', position: 'Defensa', present: true },
    { number: 6, name: 'Javier Ruiz', position: 'Centrocampista', present: true },
    { number: 5, name: 'Roberto Hernández', position: 'Defensa', present: true },
  ];

  const renderCommandTable = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('dashboard.command.table')}</h2>
        <Button variant="outline" size="sm">
          <Maximize className="w-4 h-4 mr-2" />
          {t('dashboard.full.screen')}
        </Button>
      </div>

      {/* Game Timer */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
            </div>
            <p className="font-semibold">CD Statsor</p>
            <div className="flex space-x-1 mt-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{gameTime}</div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? t('dashboard.pause') : t('dashboard.start')}
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="w-4 h-4" />
                {t('dashboard.restart')}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-yellow-600 rounded"></div>
            </div>
            <p className="font-semibold">Equipo</p>
            <div className="flex space-x-1 mt-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.actions')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                className={`${action.color} text-white text-xs p-3 h-auto`}
                variant="default"
              >
                {action.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Players */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.players')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {players.map((player, index) => (
              <div
                key={index}
                className={`${player.color} text-white p-3 rounded flex items-center space-x-2`}
              >
                <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {player.number}
                </span>
                <span className="font-semibold">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <FileText className="w-4 h-4 mr-2" />
          {t('dashboard.go.to.goals')}
        </Button>
        <Button className="bg-green-500 hover:bg-green-600">
          <BarChart3 className="w-4 h-4 mr-2" />
          {t('dashboard.save.stats')}
        </Button>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <Button variant="outline">Primera Parte</Button>
        <Button variant="outline">Segunda Parte</Button>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{t('dashboard.attendance.control')}</h2>
        <p className="text-gray-600">{t('dashboard.attendance.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('dashboard.total.players')}
          </h3>
          <p className="text-3xl font-bold text-gray-900">10</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow border border-green-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('dashboard.present')}
          </h3>
          <p className="text-3xl font-bold text-green-600">10</p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('dashboard.absent')}
          </h3>
          <p className="text-3xl font-bold text-red-600">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{t('dashboard.player.list')}</h3>
          <p className="text-sm text-gray-600">{t('dashboard.attendance.instruction')}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendancePlayers.map((player, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  player.present 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {player.number}. {player.name}
                    </div>
                    <div className="text-sm text-gray-600">{player.position}</div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    player.present ? 'bg-green-500' : 'bg-red-500'
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('dashboard.players')}</h2>
        <div className="flex items-center space-x-4">
          <select className="border rounded px-3 py-2">
            <option>{t('dashboard.no.order')}</option>
          </select>
          <Button className="bg-green-500 hover:bg-green-600">
            <Users className="w-4 h-4 mr-2" />
            {t('dashboard.add.player')}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {attendancePlayers.map((player, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-bold text-gray-600">{player.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{player.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {player.number}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {Math.floor(Math.random() * 10) + 1}
                </span>
                <span className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  {Math.floor(Math.random() * 15) + 1}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">{player.position}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t('dashboard.stats.title')}</h2>
          <p className="text-gray-600">{t('dashboard.stats.subtitle')}</p>
        </div>
        <select className="border rounded px-3 py-2">
          <option>Temporada 2023/24</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-semibold">{t('dashboard.performance')}</span>
            </div>
            <div className="text-gray-400">▼</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-green-600 rounded-full"></div>
              </div>
              <span className="font-semibold">{t('dashboard.attack')}</span>
            </div>
            <div className="text-gray-400">▼</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
              </div>
              <span className="font-semibold">{t('dashboard.defense')}</span>
            </div>
            <div className="text-gray-400">▼</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-red-600 rounded-full"></div>
              </div>
              <span className="font-semibold">{t('dashboard.discipline')}</span>
            </div>
            <div className="text-gray-400">▼</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'command-table':
        return renderCommandTable();
      case 'attendance':
        return renderAttendance();
      case 'players':
        return renderPlayers();
      case 'statistics':
        return renderStatistics();
      default:
        return renderCommandTable();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
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
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
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
              <Button onClick={handleSignOut} variant="outline" size="sm">
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

export default Dashboard;