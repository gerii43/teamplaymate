import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield, 
  Activity, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Trophy
} from 'lucide-react';

const ManualActions = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [actions, setActions] = useState<any[]>([]);

  // Mock players data
  const players = [
    { id: '1', name: 'Juan García', number: 10, position: 'Delantero' },
    { id: '2', name: 'Carlos López', number: 8, position: 'Centrocampista' },
    { id: '3', name: 'Miguel Rodríguez', number: 4, position: 'Defensa' },
    { id: '4', name: 'Antonio Martín', number: 1, position: 'Portero' },
    { id: '5', name: 'David Fernández', number: 9, position: 'Delantero' },
    { id: '6', name: 'Luis Sánchez', number: 6, position: 'Centrocampista' },
  ];

  const actionTypes = [
    { 
      category: 'Goles', 
      actions: [
        { id: 'goal_for', name: 'Gol Favor', icon: Target, color: 'bg-green-500 text-white' },
        { id: 'goal_against', name: 'Gol Contra', icon: Target, color: 'bg-red-500 text-white' }
      ]
    },
    { 
      category: 'Asistencias y Tiros', 
      actions: [
        { id: 'assist', name: 'Asistencia', icon: TrendingUp, color: 'bg-blue-500 text-white' },
        { id: 'shot_on_target', name: 'Tiro Puerta', icon: Target, color: 'bg-purple-500 text-white' },
        { id: 'shot_off_target', name: 'Tiro Fuera', icon: XCircle, color: 'bg-gray-500 text-white' }
      ]
    },
    { 
      category: 'Faltas', 
      actions: [
        { id: 'foul_for', name: 'Falta Favor', icon: Shield, color: 'bg-green-600 text-white' },
        { id: 'foul_against', name: 'Falta Contra', icon: AlertTriangle, color: 'bg-red-600 text-white' }
      ]
    },
    { 
      category: 'Balones', 
      actions: [
        { id: 'ball_lost', name: 'Balón Perdido', icon: TrendingDown, color: 'bg-orange-500 text-white' },
        { id: 'ball_recovered', name: 'Balón Recuperado', icon: TrendingUp, color: 'bg-teal-500 text-white' }
      ]
    },
    { 
      category: 'Duelos', 
      actions: [
        { id: 'duel_won', name: 'Duelo Ganado', icon: Trophy, color: 'bg-yellow-500 text-white' },
        { id: 'duel_lost', name: 'Duelo Perdido', icon: XCircle, color: 'bg-red-400 text-white' }
      ]
    },
    { 
      category: 'Portero', 
      actions: [
        { id: 'save', name: 'Parada', icon: Shield, color: 'bg-indigo-500 text-white' },
        { id: 'penalty_for', name: 'Penalti Favor', icon: Target, color: 'bg-green-700 text-white' },
        { id: 'penalty_against', name: 'Penalti Contra', icon: AlertTriangle, color: 'bg-red-700 text-white' }
      ]
    }
  ];

  const registerAction = (actionId: string, actionName: string) => {
    if (!selectedPlayer) {
      alert('Por favor, selecciona un jugador primero');
      return;
    }

    const player = players.find(p => p.id === selectedPlayer);
    const newAction = {
      id: Date.now(),
      playerId: selectedPlayer,
      playerName: player?.name,
      playerNumber: player?.number,
      actionId,
      actionName,
      timestamp: new Date().toLocaleTimeString(),
    };

    setActions(prev => [newAction, ...prev]);
  };

  const getActionIcon = (actionId: string) => {
    for (const category of actionTypes) {
      const action = category.actions.find(a => a.id === actionId);
      if (action) {
        const Icon = action.icon;
        return <Icon className="h-4 w-4" />;
      }
    }
    return <Activity className="h-4 w-4" />;
  };

  const getActionColor = (actionId: string) => {
    for (const category of actionTypes) {
      const action = category.actions.find(a => a.id === actionId);
      if (action) return action.color;
    }
    return 'bg-gray-500 text-white';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Registro Manual de Acciones</h1>
          <div className="text-sm text-gray-500">Partido en curso</div>
        </div>

        {/* Player Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Seleccionar Jugador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un jugador para registrar acciones" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    #{player.number} - {player.name} ({player.position})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-6">
          {actionTypes.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.id}
                        onClick={() => registerAction(action.id, action.name)}
                        className={`h-20 flex flex-col items-center justify-center space-y-2 ${action.color} hover:opacity-90 transition-opacity`}
                        disabled={!selectedPlayer}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{action.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Registro de Acciones ({actions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {actions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay acciones registradas aún</p>
                <p className="text-sm">Selecciona un jugador y comienza a registrar acciones</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {actions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">
                        {action.playerNumber}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{action.playerName}</p>
                        <p className="text-sm text-gray-500">#{action.playerNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getActionColor(action.actionId)} flex items-center gap-1`}>
                        {getActionIcon(action.actionId)}
                        {action.actionName}
                      </Badge>
                      <span className="text-sm text-gray-500">{action.timestamp}</span>
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

export default ManualActions;