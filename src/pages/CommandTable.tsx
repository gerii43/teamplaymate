import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Activity,
  AlertTriangle,
  Trophy,
  Zap,
  Timer,
  Square,
  Maximize,
  Minimize
} from 'lucide-react';

const CommandTable = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [liveActions, setLiveActions] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedHalf, setSelectedHalf] = useState<'first' | 'second'>('first');
  const [showGoalZoneModal, setShowGoalZoneModal] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock players data
  const players = [
    { id: '1', name: 'Juan García', number: 10, position: 'DEL', status: 'active' },
    { id: '2', name: 'Carlos López', number: 8, position: 'CC', status: 'active' },
    { id: '3', name: 'Miguel Rodríguez', number: 4, position: 'DEF', status: 'active' },
    { id: '4', name: 'Antonio Martín', number: 1, position: 'POR', status: 'active' },
    { id: '5', name: 'David Fernández', number: 9, position: 'DEL', status: 'bench' },
    { id: '6', name: 'Luis Sánchez', number: 6, position: 'CC', status: 'active' },
    { id: '7', name: 'Pedro Jiménez', number: 3, position: 'DEF', status: 'active' },
    { id: '8', name: 'Francisco Ruiz', number: 2, position: 'DEF', status: 'bench' },
  ];

  // Actions organized by importance
  const quickActions = [
    { id: 'ball_lost', name: 'BALÓN PERDIDO', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { id: 'ball_recovered', name: 'BALÓN RECUPERADO', color: 'bg-gray-500 hover:bg-gray-600' },
    { id: 'shot_goal', name: 'TIRO PUERTA', color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'shot_out', name: 'TIRO FUERA', color: 'bg-green-200 hover:bg-green-300 text-gray-800' },
  ];

  const intermediateActions = [
    { id: 'foul_favor', name: 'FALTA A FAVOR', color: 'bg-green-500 hover:bg-green-600' },
    { id: 'foul_against', name: 'FALTA CONTRA', color: 'bg-red-500 hover:bg-red-600' },
  ];

  const specialActions = [
    { id: 'goal_favor', name: 'GOL A FAVOR', color: 'bg-red-400 hover:bg-red-500' },
    { id: 'goal_against', name: 'GOL EN CONTRA', color: 'bg-red-800 hover:bg-red-900' },
    { id: 'assist', name: 'ASISTENCIA', color: 'bg-yellow-400 hover:bg-yellow-500 text-gray-800' },
    { id: 'corner_favor', name: 'CÓRNER A FAVOR', color: 'bg-green-300 hover:bg-green-400 text-gray-800' },
    { id: 'corner_against', name: 'CÓRNER EN CONTRA', color: 'bg-red-300 hover:bg-red-400 text-gray-800' },
    { id: 'save', name: 'PARADA', color: 'bg-cyan-400 hover:bg-cyan-500' },
    { id: 'penalty_favor', name: 'PENALTI A FAVOR', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'penalty_against', name: 'PENALTI EN CONTRA', color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  const registerQuickAction = (actionId: string, actionName: string) => {
    if (!selectedPlayer) {
      alert('Selecciona un jugador primero');
      return;
    }

    // Special handling for goal in favor
    if (actionId === 'goal_favor') {
      setShowGoalZoneModal(true);
      return;
    }

    const player = players.find(p => p.id === selectedPlayer);
    const newAction = {
      id: Date.now(),
      playerId: selectedPlayer,
      playerName: player?.name,
      playerNumber: player?.number,
      action: actionName,
      time: formatTime(time),
      half: selectedHalf,
      timestamp: Date.now(),
    };

    setLiveActions(prev => [newAction, ...prev]);
  };

  const handleGoalZoneSelect = (zone: number) => {
    const player = players.find(p => p.id === selectedPlayer);
    const newAction = {
      id: Date.now(),
      playerId: selectedPlayer,
      playerName: player?.name,
      playerNumber: player?.number,
      action: 'GOL A FAVOR',
      time: formatTime(time),
      half: selectedHalf,
      goalZone: zone,
      timestamp: Date.now(),
    };

    setLiveActions(prev => [newAction, ...prev]);
    setShowGoalZoneModal(false);
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setLiveActions([]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const activePlayers = players.filter(p => p.status === 'active');
  const benchPlayers = players.filter(p => p.status === 'bench');

  return (
    <Layout>
      <div className="p-4 w-full min-h-screen">
        {/* Botón de pantalla completa */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4" />
                Salir de pantalla completa
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4" />
                Pantalla completa
              </>
            )}
          </Button>
        </div>

        {/* Header ocupando toda la pantalla - Cronómetro y Marcador */}
        <div className="w-full mb-6">
          <div className="w-full bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              {/* CD Statsor */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-500 rounded-lg mb-2"></div>
                <span className="text-lg font-semibold text-gray-800">CD Statsor</span>
                <div className="flex gap-1 mt-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Timer y controles centrales */}
              <div className="flex flex-col items-center">
                <div className="text-6xl font-mono font-bold text-gray-900 mb-4">
                  {formatTime(time)}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    onClick={startTimer}
                    disabled={isRunning}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Iniciar
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reiniciar
                  </Button>
                </div>
              </div>

              {/* Rival */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-yellow-500 rounded-lg mb-2"></div>
                <span className="text-lg font-semibold text-gray-800">Equipo</span>
                <div className="flex gap-1 mt-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de parte del partido */}
        <div className="flex justify-center mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              onClick={() => setSelectedHalf('first')}
              variant={selectedHalf === 'first' ? 'default' : 'ghost'}
              size="sm"
              className={selectedHalf === 'first' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
            >
              Primera parte
            </Button>
            <Button
              onClick={() => setSelectedHalf('second')}
              variant={selectedHalf === 'second' ? 'default' : 'ghost'}
              size="sm"
              className={selectedHalf === 'second' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
            >
              Segunda parte
            </Button>
          </div>
        </div>

        {/* Contenido principal - Acciones (izq) y Jugadores (der) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Acciones */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Acciones</h2>
            
            {/* Grid de acciones - estructura exacta como la imagen */}
            <div className="grid grid-cols-2 gap-3">
              {/* Acciones rápidas */}
              <Button
                onClick={() => registerQuickAction('ball_lost', 'BALÓN PERDIDO')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                BALÓN PERDIDO
              </Button>
              <Button
                onClick={() => registerQuickAction('ball_recovered', 'BALÓN RECUPERADO')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-gray-500 hover:bg-gray-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                BALÓN RECUPERADO
              </Button>
              <Button
                onClick={() => registerQuickAction('shot_goal', 'TIRO PUERTA')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-purple-500 hover:bg-purple-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                TIRO PUERTA
              </Button>
              <Button
                onClick={() => registerQuickAction('shot_out', 'TIRO FUERA')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-green-400 hover:bg-green-500 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                TIRO FUERA
              </Button>

              {/* Acciones intermedias */}
              <Button
                onClick={() => registerQuickAction('foul_against', 'FALTA CONTRA')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-red-500 hover:bg-red-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                FALTA CONTRA
              </Button>
              <Button
                onClick={() => registerQuickAction('foul_favor', 'FALTA A FAVOR')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-green-500 hover:bg-green-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                FALTA A FAVOR
              </Button>

              {/* Acciones especiales */}
              <Button
                onClick={() => registerQuickAction('penalty_favor', 'PENALTI A FAVOR')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-blue-500 hover:bg-blue-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                PENALTI A FAVOR
              </Button>
              <Button
                onClick={() => registerQuickAction('penalty_against', 'PENALTI EN CONTRA')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-orange-500 hover:bg-orange-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                PENALTI EN CONTRA
              </Button>
              <Button
                onClick={() => registerQuickAction('goal_favor', 'GOL A FAVOR')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-red-400 hover:bg-red-500 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                GOL A FAVOR
              </Button>
              <Button
                onClick={() => registerQuickAction('goal_against', 'GOL EN CONTRA')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-red-800 hover:bg-red-900 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                GOL EN CONTRA
              </Button>
              <Button
                onClick={() => registerQuickAction('assist', 'ASISTENCIA')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 text-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ASISTENCIA
              </Button>
              <Button
                onClick={() => registerQuickAction('save', 'PARADA')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-cyan-400 hover:bg-cyan-500 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                PARADA
              </Button>
              <Button
                onClick={() => registerQuickAction('corner_favor', 'CÓRNER A FAVOR')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-green-300 hover:bg-green-400 text-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                CÓRNER A FAVOR
              </Button>
              <Button
                onClick={() => registerQuickAction('corner_against', 'CÓRNER EN CONTRA')}
                disabled={!selectedPlayer}
                className={`h-16 text-sm font-semibold bg-red-300 hover:bg-red-400 text-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                CÓRNER EN CONTRA
              </Button>
            </div>
          </div>

          {/* Columna derecha - Jugadores */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Jugadores</h2>
            
            {/* Jugadores en grid de 2 columnas */}
            <div className="grid grid-cols-2 gap-3">
              {players.map((player) => (
                <Button
                  key={player.id}
                  onClick={() => setSelectedPlayer(player.id)}
                  className={`h-16 text-sm font-semibold ${
                    selectedPlayer === player.id 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <div className="w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center mr-2 font-bold text-sm">
                    {player.number}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{player.name.split(' ')[0]}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Live Actions */}
            {liveActions.length > 0 && (
              <Card className="p-4 mt-4">
                <h3 className="font-semibold text-sm mb-3 text-center bg-gray-100 py-2 rounded-md">ÚLTIMAS ACCIONES</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {liveActions.slice(0, 5).map((action) => (
                    <div key={action.id} className="text-xs text-gray-700 flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{action.action}</span>
                      <span className="font-mono text-gray-500">{action.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Goal Zone Modal */}
        <Dialog open={showGoalZoneModal} onOpenChange={setShowGoalZoneModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Selecciona la zona del gol</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((zone) => (
                  <Button
                    key={zone}
                    onClick={() => handleGoalZoneSelect(zone)}
                    variant="outline"
                    className="h-16 w-16 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-500 text-sm font-semibold"
                  >
                    {zone}
                  </Button>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setShowGoalZoneModal(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CommandTable;