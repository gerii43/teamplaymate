import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

const ManualActions = () => {
  // Mock players data
  const players = [
    { id: 1, name: 'Carlos Rodríguez', number: 7, position: 'Delantero' },
    { id: 2, name: 'Miguel Ángel Torres', number: 10, position: 'Centrocampista' },
    { id: 3, name: 'David López', number: 4, position: 'Defensa' },
    { id: 4, name: 'Juan Martínez', number: 9, position: 'Delantero' },
    { id: 5, name: 'Roberto García', number: 6, position: 'Centrocampista' },
    { id: 6, name: 'Luis Sánchez', number: 3, position: 'Defensa' },
    { id: 7, name: 'Antonio Pérez', number: 2, position: 'Defensa' },
    { id: 8, name: 'Fernando Ruiz', number: 11, position: 'Delantero' },
    { id: 9, name: 'Pablo Díaz', number: 8, position: 'Centrocampista' },
    { id: 10, name: 'Javier Moreno', number: 1, position: 'Portero' },
  ];

  // State para las estadísticas de cada jugador
  const [playerStats, setPlayerStats] = useState(() => {
    const initialStats: any = {};
    players.forEach(player => {
      initialStats[player.id] = {
        goles: 0,
        asistencias: 0,
        balonesPerdidos: 0,
        balonesRecuperados: 0,
        duelosGanados: 0,
        duelosPerdidos: 0,
        tirosPorteria: 0,
        tirosFuera: 0,
        faltasCometidas: 0,
        faltasRecibidas: 0,
        paradas: 0,
      };
    });
    return initialStats;
  });

  const updateStat = (playerId: number, stat: string, increment: boolean) => {
    setPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [stat]: Math.max(0, prev[playerId][stat] + (increment ? 1 : -1))
      }
    }));
  };

  const StatCounter = ({ value, onIncrement, onDecrement }: { value: number, onIncrement: () => void, onDecrement: () => void }) => (
    <div className="flex items-center justify-center space-x-1">
      <Button
        size="sm"
        variant="outline"
        className="h-6 w-6 p-0 hover:bg-red-50 hover:border-red-300"
        onClick={onDecrement}
      >
        <Minus className="h-3 w-3 text-red-600" />
      </Button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <Button
        size="sm"
        variant="outline"
        className="h-6 w-6 p-0 hover:bg-green-50 hover:border-green-300"
        onClick={onIncrement}
      >
        <Plus className="h-3 w-3 text-green-600" />
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Tabla de Registro de Acciones</h1>
          <div className="text-sm text-gray-500">Registro en tiempo real</div>
        </div>

        {/* Tabla de Registro de Acciones */}
        <Card>
          <CardHeader>
            <CardTitle>Registro Manual de Estadísticas por Jugador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">Jugador</th>
                    <th className="text-center p-3 font-medium">Goles</th>
                    <th className="text-center p-3 font-medium">Asistencias</th>
                    <th className="text-center p-3 font-medium">Balones Perdidos</th>
                    <th className="text-center p-3 font-medium">Balones Recuperados</th>
                    <th className="text-center p-3 font-medium">Duelos Ganados</th>
                    <th className="text-center p-3 font-medium">Duelos Perdidos</th>
                    <th className="text-center p-3 font-medium">Tiros a Portería</th>
                    <th className="text-center p-3 font-medium">Tiros Fuera</th>
                    <th className="text-center p-3 font-medium">Faltas Cometidas</th>
                    <th className="text-center p-3 font-medium">Faltas Recibidas</th>
                    <th className="text-center p-3 font-medium">Paradas</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">
                            {player.number}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{player.name}</p>
                            <p className="text-xs text-gray-500">{player.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.goles || 0}
                          onIncrement={() => updateStat(player.id, 'goles', true)}
                          onDecrement={() => updateStat(player.id, 'goles', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.asistencias || 0}
                          onIncrement={() => updateStat(player.id, 'asistencias', true)}
                          onDecrement={() => updateStat(player.id, 'asistencias', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.balonesPerdidos || 0}
                          onIncrement={() => updateStat(player.id, 'balonesPerdidos', true)}
                          onDecrement={() => updateStat(player.id, 'balonesPerdidos', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.balonesRecuperados || 0}
                          onIncrement={() => updateStat(player.id, 'balonesRecuperados', true)}
                          onDecrement={() => updateStat(player.id, 'balonesRecuperados', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.duelosGanados || 0}
                          onIncrement={() => updateStat(player.id, 'duelosGanados', true)}
                          onDecrement={() => updateStat(player.id, 'duelosGanados', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.duelosPerdidos || 0}
                          onIncrement={() => updateStat(player.id, 'duelosPerdidos', true)}
                          onDecrement={() => updateStat(player.id, 'duelosPerdidos', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.tirosPorteria || 0}
                          onIncrement={() => updateStat(player.id, 'tirosPorteria', true)}
                          onDecrement={() => updateStat(player.id, 'tirosPorteria', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.tirosFuera || 0}
                          onIncrement={() => updateStat(player.id, 'tirosFuera', true)}
                          onDecrement={() => updateStat(player.id, 'tirosFuera', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.faltasCometidas || 0}
                          onIncrement={() => updateStat(player.id, 'faltasCometidas', true)}
                          onDecrement={() => updateStat(player.id, 'faltasCometidas', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <StatCounter
                          value={playerStats[player.id]?.faltasRecibidas || 0}
                          onIncrement={() => updateStat(player.id, 'faltasRecibidas', true)}
                          onDecrement={() => updateStat(player.id, 'faltasRecibidas', false)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        {player.position === 'Portero' ? (
                          <StatCounter
                            value={playerStats[player.id]?.paradas || 0}
                            onIncrement={() => updateStat(player.id, 'paradas', true)}
                            onDecrement={() => updateStat(player.id, 'paradas', false)}
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManualActions;