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
  Timer
} from 'lucide-react';

const CommandTable = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [liveActions, setLiveActions] = useState<any[]>([]);

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

  const quickActions = [
    { id: 'goal', name: 'GOL', icon: Target, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'assist', name: 'ASISTENCIA', icon: TrendingUp, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'shot', name: 'TIRO', icon: Target, color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'foul', name: 'FALTA', icon: AlertTriangle, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { id: 'save', name: 'PARADA', icon: Shield, color: 'bg-indigo-500 hover:bg-indigo-600' },
    { id: 'card', name: 'TARJETA', icon: Activity, color: 'bg-red-500 hover:bg-red-600' },
    { id: 'duel', name: 'DUELO', icon: Trophy, color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'sub', name: 'CAMBIO', icon: Users, color: 'bg-gray-500 hover:bg-gray-600' },
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

  const activePlayers = players.filter(p => p.status === 'active');
  const benchPlayers = players.filter(p => p.status === 'bench');

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Tabla de Comandos</h1>
          <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
            Partido en Directo
          </Badge>
        </div>

        {/* Match Timer */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-mono font-bold text-blue-600">
                  {formatTime(time)}
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={startTimer}
                    disabled={isRunning}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </Button>
                  <Button
                    onClick={pauseTimer}
                    disabled={!isRunning}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Estado del Cronómetro</p>
                <p className="text-lg font-semibold">
                  {isRunning ? (
                    <span className="text-green-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      En Marcha
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <Pause className="h-4 w-4 mr-1" />
                      Pausado
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Players Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Jugadores en Campo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {activePlayers.map((player) => (
                  <Button
                    key={player.id}
                    onClick={() => setSelectedPlayer(player.id)}
                    variant={selectedPlayer === player.id ? "default" : "outline"}
                    className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                      selectedPlayer === player.id 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-lg">#{player.number}</div>
                    <div className="text-xs">{player.name}</div>
                    <div className="text-xs opacity-75">{player.position}</div>
                  </Button>
                ))}
              </div>
              
              {benchPlayers.length > 0 && (
                <>
                  <div className="mt-4 mb-2 text-sm font-medium text-gray-600">Suplentes</div>
                  <div className="grid grid-cols-3 gap-2">
                    {benchPlayers.map((player) => (
                      <Button
                        key={player.id}
                        onClick={() => setSelectedPlayer(player.id)}
                        variant="outline"
                        size="sm"
                        className={`h-12 flex flex-col items-center justify-center ${
                          selectedPlayer === player.id ? 'bg-blue-100 border-blue-300' : ''
                        }`}
                      >
                        <div className="font-bold">#{player.number}</div>
                        <div className="text-xs">{player.name.split(' ')[0]}</div>
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      onClick={() => registerQuickAction(action.id, action.name)}
                      disabled={!selectedPlayer}
                      className={`h-16 flex flex-col items-center justify-center space-y-2 text-white ${action.color} ${
                        !selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{action.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Actions Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Registro en Directo ({liveActions.length} acciones)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liveActions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay acciones registradas</p>
                <p className="text-sm">Selecciona un jugador y registra acciones en tiempo real</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {liveActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {action.playerNumber}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{action.playerName}</p>
                        <p className="text-sm text-blue-600 font-medium">{action.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-lg text-blue-600">{action.time}</div>
                      <div className="text-xs text-gray-500">En directo</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CommandTable;