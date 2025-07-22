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
  const [homeTeamFouls, setHomeTeamFouls] = useState(0);
  const [awayTeamFouls, setAwayTeamFouls] = useState(0);

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

  // Mock players data - 14 players with goalkeeper first
  const players = [
    { id: '1', name: 'Alejandro', number: 1, position: 'POR', status: 'active' },
    { id: '2', name: 'Juan', number: 9, position: 'DEL', status: 'active' },
    { id: '3', name: 'Miguel', number: 8, position: 'CC', status: 'active' },
    { id: '4', name: 'Carlos', number: 4, position: 'DEF', status: 'active' },
    { id: '5', name: 'Fernando', number: 7, position: 'DEL', status: 'active' },
    { id: '6', name: 'David', number: 2, position: 'DEF', status: 'active' },
    { id: '7', name: 'Antonio', number: 3, position: 'DEF', status: 'active' },
    { id: '8', name: 'Pablo', number: 10, position: 'CC', status: 'active' },
    { id: '9', name: 'Javier', number: 6, position: 'CC', status: 'active' },
    { id: '10', name: 'Roberto', number: 5, position: 'DEF', status: 'active' },
    { id: '11', name: 'Luis', number: 11, position: 'DEL', status: 'active' },
    { id: '12', name: 'Manuel', number: 14, position: 'CC', status: 'active' },
    { id: '13', name: 'Pedro', number: 15, position: 'DEF', status: 'active' },
    { id: '14', name: 'Francisco', number: 16, position: 'DEL', status: 'active' },
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

    // Special handling for fouls - update foul counters
    if (actionId === 'foul_favor') {
      setAwayTeamFouls(prev => Math.min(prev + 1, 5));
    } else if (actionId === 'foul_against') {
      setHomeTeamFouls(prev => Math.min(prev + 1, 5));
    }

    // Special handling for goal in favor
    if (actionId === 'goal_favor') {
      setShowGoalZoneModal(true);
      return;
    }

    const player = players.find(p => p.id === selectedPlayer);
    const halfText = selectedHalf === 'first' ? 'Primera Parte' : 'Segunda Parte';
    const newAction = {
      id: Date.now(),
      playerId: selectedPlayer,
      playerName: player?.name,
      playerNumber: player?.number,
      action: `${actionName} ${player?.name} - ${halfText}`,
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
      <div className="p-2 w-full min-h-screen">
        {/* Header ocupando toda la pantalla - Cronómetro y Marcador */}
        <div className="w-full mb-4">
          <div className="w-full bg-white p-4 rounded-lg shadow-lg border">
            {/* Cronómetro central con equipos pegados */}
            <div className="flex items-center justify-center mb-6">
              {/* CD Statsor - Equipo local (izquierda) */}
              <div className="flex flex-col items-center mr-8">
                <div className="w-16 h-16 bg-blue-500 rounded-lg mb-2 shadow-md"></div>
                <span className="text-sm font-semibold text-gray-800">CD Statsor</span>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHomeTeamFouls(i < homeTeamFouls ? homeTeamFouls - 1 : homeTeamFouls + 1)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < homeTeamFouls ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Cronómetro central */}
              <div className="flex flex-col items-center">
                <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
                  {formatTime(time)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={startTimer}
                    disabled={isRunning}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Iniciar
                  </Button>
                  <Button
                    onClick={pauseTimer}
                    disabled={!isRunning}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pausar
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reiniciar
                  </Button>
                </div>
                
                {/* Selector de parte - cuadrados 1 y 2 */}
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => setSelectedHalf('first')}
                    className={`w-8 h-8 text-sm font-bold ${
                      selectedHalf === 'first' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-400 hover:bg-blue-500 text-white'
                    }`}
                  >
                    1
                  </Button>
                  <Button
                    onClick={() => setSelectedHalf('second')}
                    className={`w-8 h-8 text-sm font-bold ${
                      selectedHalf === 'second' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-400 hover:bg-blue-500 text-white'
                    }`}
                  >
                    2
                  </Button>
                </div>
              </div>

              {/* Equipo visitante (derecha) */}
              <div className="flex flex-col items-center ml-8">
                <div className="w-16 h-16 bg-yellow-500 rounded-lg mb-2 shadow-md"></div>
                <span className="text-sm font-semibold text-gray-800">Equipo</span>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setAwayTeamFouls(i < awayTeamFouls ? awayTeamFouls - 1 : awayTeamFouls + 1)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < awayTeamFouls ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Contenido principal - Acciones (izq) y Jugadores (der) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Columna izquierda - Acciones */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">Acciones</h2>
            
            {/* Grid de acciones replicando exactamente la imagen */}
            <div className="grid grid-cols-2 gap-2 shadow-lg rounded-lg bg-white p-3">
              {/* Fila 1 - según imagen */}
              <Button
                onClick={() => registerQuickAction('foul_against', 'FALTA CONTRA')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                FALTA CONTRA
              </Button>
              <Button
                onClick={() => registerQuickAction('foul_favor', 'FALTA A FAVOR')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                FALTA A FAVOR
              </Button>

              {/* Fila 2 - según imagen */}
              <Button
                onClick={() => registerQuickAction('penalty_favor', 'PENALTI A FAVOR')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                PENALTI A FAVOR
              </Button>
              <Button
                onClick={() => registerQuickAction('penalty_against', 'PENALTI EN CONTRA')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                PENALTI EN CONTRA
              </Button>

              {/* Fila 3 - según imagen */}
              <Button
                onClick={() => registerQuickAction('ball_lost', 'BALÓN PERDIDO')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-green-400 hover:bg-green-500 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                BALÓN PERDIDO
              </Button>
              <Button
                onClick={() => registerQuickAction('ball_recovered', 'BALÓN RECUPERADO')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-gray-500 hover:bg-gray-600 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                BALÓN RECUPERADO
              </Button>

              {/* Fila 4 - según imagen */}
              <Button
                onClick={() => registerQuickAction('duel_won', 'DUELO GANADO')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-pink-500 hover:bg-pink-600 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                DUELO GANADO
              </Button>
              <Button
                onClick={() => registerQuickAction('duel_lost', 'DUELO PERDIDO')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-black hover:bg-gray-800 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                DUELO PERDIDO
              </Button>

              {/* Fila 5 - según imagen */}
              <Button
                onClick={() => registerQuickAction('goal_favor', 'GOL A FAVOR')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-red-400 hover:bg-red-500 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                GOL A FAVOR
              </Button>
              <Button
                onClick={() => registerQuickAction('goal_against', 'GOL EN CONTRA')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-red-700 hover:bg-red-800 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                GOL EN CONTRA
              </Button>

              {/* Fila 6 - según imagen */}
              <Button
                onClick={() => registerQuickAction('assist', 'ASISTENCIA')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-yellow-400 hover:bg-yellow-500 text-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ASISTENCIA
              </Button>
              <Button
                onClick={() => registerQuickAction('save', 'PARADA')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-cyan-400 hover:bg-cyan-500 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                PARADA
              </Button>

              {/* Fila 7 - según imagen */}
              <Button
                onClick={() => registerQuickAction('shot_goal', 'TIRO A PUERTA')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-purple-500 hover:bg-purple-600 text-white ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                TIRO A PUERTA
              </Button>
              <Button
                onClick={() => registerQuickAction('shot_out', 'TIRO FUERA')}
                disabled={!selectedPlayer}
                className={`h-12 text-xs font-semibold bg-green-300 hover:bg-green-400 text-gray-800 ${!selectedPlayer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                TIRO FUERA
              </Button>
            </div>
          </div>

          {/* Columna derecha - Jugadores */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">Jugadores</h2>
            
            {/* Jugadores en grid de 2 columnas con sombra */}
            <div className="grid grid-cols-2 gap-2 shadow-lg rounded-lg bg-white p-3">
              {players.map((player) => (
                <Button
                  key={player.id}
                  onClick={() => setSelectedPlayer(player.id)}
                  className={`h-10 text-xs font-semibold transition-all ${
                    selectedPlayer === player.id 
                      ? 'bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-300' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <div className="w-5 h-5 bg-white text-gray-700 rounded-full flex items-center justify-center mr-1 font-bold text-xs">
                    {player.number}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-xs">{player.name}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Confirmación de acción - Visible inmediatamente */}
            {liveActions.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg shadow-lg border">
                <h3 className="font-semibold text-sm mb-2 text-center bg-gray-100 py-1 rounded-md">ÚLTIMA ACCIÓN</h3>
                <div className="text-sm text-gray-700 text-center p-2 bg-green-50 rounded border">
                  <span className="font-medium">{liveActions[0].action}</span>
                  <div className="text-xs text-gray-500 mt-1">{liveActions[0].time}</div>
                </div>
              </div>
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