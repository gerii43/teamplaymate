import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  // Actions organized by categories
  const offensiveActions = [
    { id: 'goal_favor', name: 'GOL FAVOR', icon: Target, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'assist', name: 'ASISTENCIA', icon: TrendingUp, color: 'bg-yellow-200 hover:bg-yellow-300 text-gray-800' },
    { id: 'shot_goal', name: 'TIRO PUERTA', icon: Target, color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'shot_out', name: 'TIRO FUERA', icon: AlertTriangle, color: 'bg-gray-400 hover:bg-gray-500' },
  ];

  const defensiveActions = [
    { id: 'ball_recovered', name: 'BALÓN RECUPERADO', icon: Shield, color: 'bg-gray-500 hover:bg-gray-600' },
    { id: 'duel_won', name: 'DUELO GANADO', icon: Trophy, color: 'bg-pink-500 hover:bg-pink-600' },
    { id: 'save', name: 'PARADA', icon: Shield, color: 'bg-blue-300 hover:bg-blue-400 text-gray-800' },
    { id: 'goal_against', name: 'GOL CONTRA', icon: Target, color: 'bg-red-800 hover:bg-red-900' },
  ];

  const penaltyActions = [
    { id: 'foul_against', name: 'FALTA CONTRA', icon: AlertTriangle, color: 'bg-red-500 hover:bg-red-600' },
    { id: 'foul_favor', name: 'FALTA A FAVOR', icon: AlertTriangle, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'penalty_favor', name: 'PENALTI FAVOR', icon: Activity, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'penalty_against', name: 'PENALTI CONTRA', icon: Activity, color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'ball_lost', name: 'BALÓN PERDIDO', icon: AlertTriangle, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { id: 'duel_lost', name: 'DUELO PERDIDO', icon: Trophy, color: 'bg-black hover:bg-gray-800' },
  ];

  const registerQuickAction = (actionId: string, actionName: string) => {
    if (!selectedPlayer) {
      alert('Selecciona un jugador primero');
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
      timestamp: Date.now(),
    };

    setLiveActions(prev => [newAction, ...prev]);
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
      <div className="p-4 max-w-7xl mx-auto">
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

        {/* Header centrado - Cronómetro y Marcador (más pequeño) */}
        <div className="flex justify-center mb-6">
          <Card className="p-4 max-w-lg w-full">
            <div className="text-center space-y-3">
              {/* Timer */}
              <div className="text-4xl font-mono font-bold text-gray-900">
                {formatTime(time)}
              </div>
              
              {/* Teams and Score */}
              <div className="flex items-center justify-center gap-4 text-lg font-semibold">
                <span className="text-gray-800">CD Statsor</span>
                <div className="text-2xl font-bold text-gray-900">1 - 0</div>
                <span className="text-gray-800">Rival</span>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center space-x-2">
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
                  onClick={pauseTimer}
                  disabled={!isRunning}
                  variant="outline"
                  size="sm"
                >
                  <Pause className="h-3 w-3 mr-1" />
                  Pausar
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reiniciar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Square className="h-3 w-3 mr-1" />
                  Finalizar
                </Button>
              </div>
              <div className="text-xs text-gray-600">1ª parte</div>
            </div>
          </Card>
        </div>

        {/* Contenido principal - Acciones (izq) y Jugadores (der) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Acciones por categorías */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* ATAQUE */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-center bg-orange-100 py-2 rounded-md flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                ATAQUE
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => registerQuickAction('goal_favor', 'GOL FAVOR')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-green-500 hover:bg-green-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Target className="h-5 w-5 mr-2" />
                  GOL FAVOR
                </Button>
                <Button
                  onClick={() => registerQuickAction('assist', 'ASISTENCIA')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 text-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  ASISTENCIA
                </Button>
                <Button
                  onClick={() => registerQuickAction('shot_goal', 'TIRO PUERTA')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-purple-500 hover:bg-purple-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Target className="h-5 w-5 mr-2" />
                  TIRO PUERTA
                </Button>
                <Button
                  onClick={() => registerQuickAction('shot_out', 'TIRO FUERA')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-green-200 hover:bg-green-300 text-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  TIRO FUERA
                </Button>
              </div>
            </Card>

            {/* DEFENSA */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-center bg-blue-100 py-2 rounded-md flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                DEFENSA
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => registerQuickAction('ball_recovered', 'BALÓN RECUPERADO')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-gray-500 hover:bg-gray-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  BALÓN RECUPERADO
                </Button>
                <Button
                  onClick={() => registerQuickAction('ball_lost', 'BALÓN PERDIDO')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  BALÓN PERDIDO
                </Button>
                <Button
                  onClick={() => registerQuickAction('duel_won', 'DUELO GANADO')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-pink-500 hover:bg-pink-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  DUELO GANADO
                </Button>
                <Button
                  onClick={() => registerQuickAction('duel_lost', 'DUELO PERDIDO')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-black hover:bg-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  DUELO PERDIDO
                </Button>
              </div>
            </Card>

            {/* FALTAS */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-center bg-red-100 py-2 rounded-md flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                FALTAS
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => registerQuickAction('foul_favor', 'FALTA A FAVOR')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-green-500 hover:bg-green-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  FALTA A FAVOR
                </Button>
                <Button
                  onClick={() => registerQuickAction('foul_against', 'FALTA CONTRA')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-red-500 hover:bg-red-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  FALTA CONTRA
                </Button>
                <Button
                  onClick={() => registerQuickAction('penalty_favor', 'PENALTI FAVOR')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-blue-500 hover:bg-blue-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Activity className="h-5 w-5 mr-2" />
                  PENALTI FAVOR
                </Button>
                <Button
                  onClick={() => registerQuickAction('penalty_against', 'PENALTI CONTRA')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-orange-500 hover:bg-orange-600 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Activity className="h-5 w-5 mr-2" />
                  PENALTI CONTRA
                </Button>
              </div>
            </Card>

            {/* PORTERÍA */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-center bg-cyan-100 py-2 rounded-md flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-cyan-600" />
                PORTERÍA
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => registerQuickAction('save', 'PARADA')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-blue-300 hover:bg-blue-400 text-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  PARADA
                </Button>
                <Button
                  onClick={() => registerQuickAction('goal_against', 'GOL CONTRA')}
                  disabled={!selectedPlayer}
                  className={`h-16 text-sm font-semibold bg-red-800 hover:bg-red-900 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Target className="h-5 w-5 mr-2" />
                  GOL CONTRA
                </Button>
              </div>
            </Card>
          </div>

          {/* Columna derecha - Jugadores */}
          <div className="lg:col-span-1">
            <Card className="p-4 h-fit">
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-center bg-green-100 py-2 rounded-md flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  JUGADORES
                </h3>
                <div className="text-center mt-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedPlayer ? `#${players.find(p => p.id === selectedPlayer)?.number} - ${players.find(p => p.id === selectedPlayer)?.name}` : 'Ninguno seleccionado'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {players.map((player) => (
                  <Button
                    key={player.id}
                    onClick={() => setSelectedPlayer(player.id)}
                    variant={selectedPlayer === player.id ? "default" : "outline"}
                    className={`w-full h-14 justify-start text-left font-semibold ${
                      selectedPlayer === player.id 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'hover:bg-green-50 hover:border-green-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center mr-3 font-bold text-sm">
                      {player.number}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-xs opacity-75">{player.position}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

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
      </div>
    </Layout>
  );
};

export default CommandTable;