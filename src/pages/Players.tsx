import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Trophy, Target, Clock, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Player {
  id: string;
  number: number;
  name: string;
  position: string;
  age: number;
  goals: number;
  assists: number;
  games: number;
  yellowCards: number;
  redCards: number;
  minutes: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passAccuracy: number;
  foulsCommitted: number;
  foulsReceived: number;
  ballsLost: number;
  ballsRecovered: number;
  duelsWon: number;
  duelsLost: number;
  crosses: number;
  saves?: number;
}

const Players = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const players: Player[] = [
    {
      id: '1',
      number: 9,
      name: 'Fernando Torres',
      position: 'DEL',
      age: 28,
      goals: 5,
      assists: 3,
      games: 8,
      yellowCards: 0,
      redCards: 0,
      minutes: 480,
      shots: 12,
      shotsOnTarget: 8,
      passes: 120,
      passAccuracy: 85,
      foulsCommitted: 2,
      foulsReceived: 8,
      ballsLost: 15,
      ballsRecovered: 25,
      duelsWon: 18,
      duelsLost: 7,
      crosses: 5
    },
    {
      id: '2',
      number: 8,
      name: 'Pablo Sánchez',
      position: 'CEN',
      age: 26,
      goals: 2,
      assists: 6,
      games: 8,
      yellowCards: 2,
      redCards: 0,
      minutes: 465,
      shots: 8,
      shotsOnTarget: 5,
      passes: 180,
      passAccuracy: 92,
      foulsCommitted: 4,
      foulsReceived: 5,
      ballsLost: 12,
      ballsRecovered: 28,
      duelsWon: 22,
      duelsLost: 9,
      crosses: 12
    },
    {
      id: '3',
      number: 4,
      name: 'Juan Pérez',
      position: 'DEL',
      age: 24,
      goals: 3,
      assists: 2,
      games: 7,
      yellowCards: 1,
      redCards: 0,
      minutes: 420,
      shots: 10,
      shotsOnTarget: 6,
      passes: 95,
      passAccuracy: 78,
      foulsCommitted: 3,
      foulsReceived: 6,
      ballsLost: 18,
      ballsRecovered: 20,
      duelsWon: 15,
      duelsLost: 8,
      crosses: 3
    },
    {
      id: '4',
      number: 1,
      name: 'Alejandro Martínez',
      position: 'POR',
      age: 30,
      goals: 0,
      assists: 0,
      games: 8,
      yellowCards: 0,
      redCards: 0,
      minutes: 720,
      shots: 0,
      shotsOnTarget: 0,
      passes: 65,
      passAccuracy: 88,
      foulsCommitted: 1,
      foulsReceived: 2,
      ballsLost: 5,
      ballsRecovered: 8,
      duelsWon: 3,
      duelsLost: 1,
      crosses: 0,
      saves: 15
    },
    {
      id: '5',
      number: 2,
      name: 'David González',
      position: 'DEF',
      age: 27,
      goals: 1,
      assists: 0,
      games: 8,
      yellowCards: 1,
      redCards: 0,
      minutes: 480,
      shots: 3,
      shotsOnTarget: 1,
      passes: 150,
      passAccuracy: 90,
      foulsCommitted: 8,
      foulsReceived: 2,
      ballsLost: 8,
      ballsRecovered: 35,
      duelsWon: 25,
      duelsLost: 6,
      crosses: 8
    }
  ];

  const renderPlayerDetail = () => {
    if (!selectedPlayer) return null;

    const performanceData = [
      { name: 'Goles', value: selectedPlayer.goals },
      { name: 'Asistencias', value: selectedPlayer.assists },
      { name: 'Faltas', value: selectedPlayer.foulsCommitted },
      { name: 'Duelos Ganados', value: selectedPlayer.duelsWon },
      { name: 'Balones Recuperados', value: selectedPlayer.ballsRecovered },
      { name: 'Tiros a Portería', value: selectedPlayer.shotsOnTarget }
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSelectedPlayer(null)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Jugadores</span>
          </Button>
        </div>

        {/* Player Info */}
        <Card className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {selectedPlayer.number}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedPlayer.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {selectedPlayer.position}
                </span>
                <span className="text-gray-600">#{selectedPlayer.number}</span>
                <span className="text-gray-600">{selectedPlayer.age} años</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Activo</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Partidos Jugados</p>
                <p className="text-3xl font-bold">{selectedPlayer.games}</p>
              </div>
              <Clock className="w-12 h-12 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Goles</p>
                <p className="text-3xl font-bold">{selectedPlayer.goals}</p>
              </div>
              <Trophy className="w-12 h-12 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Asistencias</p>
                <p className="text-3xl font-bold">{selectedPlayer.assists}</p>
              </div>
              <Target className="w-12 h-12 text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Tarjetas</p>
                <p className="text-3xl font-bold">{selectedPlayer.yellowCards + selectedPlayer.redCards}</p>
              </div>
              <Award className="w-12 h-12 text-yellow-200" />
            </div>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Estadísticas Detalladas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Minutos jugados:</span>
                <span className="font-semibold">{selectedPlayer.minutes}'</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tiros a portería:</span>
                <span className="font-semibold">{selectedPlayer.shotsOnTarget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tiros fuera:</span>
                <span className="font-semibold">{selectedPlayer.shots - selectedPlayer.shotsOnTarget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Precisión de pases:</span>
                <span className="font-semibold">{selectedPlayer.passAccuracy}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Faltas cometidas:</span>
                <span className="font-semibold">{selectedPlayer.foulsCommitted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Faltas recibidas:</span>
                <span className="font-semibold">{selectedPlayer.foulsReceived}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balones perdidos:</span>
                <span className="font-semibold">{selectedPlayer.ballsLost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balones recuperados:</span>
                <span className="font-semibold">{selectedPlayer.ballsRecovered}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Duelos ganados:</span>
                <span className="font-semibold">{selectedPlayer.duelsWon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duelos perdidos:</span>
                <span className="font-semibold">{selectedPlayer.duelsLost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Centros:</span>
                <span className="font-semibold">{selectedPlayer.crosses}</span>
              </div>
              {selectedPlayer.saves !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paradas:</span>
                  <span className="font-semibold">{selectedPlayer.saves}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Performance Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Gráfico de Rendimiento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  };

  const renderPlayersList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Jugadores</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <Card 
            key={player.id} 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedPlayer(player)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {player.number}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{player.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {player.position}
                  </span>
                  <span className="text-sm text-gray-600">{player.age} años</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">{player.goals}</div>
                <div className="text-xs text-gray-600">Goles</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{player.assists}</div>
                <div className="text-xs text-gray-600">Asistencias</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-600">{player.games}</div>
                <div className="text-xs text-gray-600">Partidos</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6">
        {selectedPlayer ? renderPlayerDetail() : renderPlayersList()}
      </div>
    </Layout>
  );
};

export default Players;