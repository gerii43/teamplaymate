import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Trophy, Target, Clock, Award, Camera, Upload } from 'lucide-react';
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
  photo?: string;
  shotMap?: { [key: string]: number };
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
      crosses: 5,
      photo: '/placeholder.svg',
      shotMap: { 'top-left': 2, 'top-center': 1, 'top-right': 0, 'middle-left': 0, 'middle-center': 1, 'middle-right': 1, 'bottom-left': 0, 'bottom-center': 0, 'bottom-right': 0 }
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
      crosses: 12,
      photo: '/placeholder.svg',
      shotMap: { 'top-left': 1, 'top-center': 0, 'top-right': 1, 'middle-left': 0, 'middle-center': 0, 'middle-right': 0, 'bottom-left': 0, 'bottom-center': 0, 'bottom-right': 0 }
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
      crosses: 3,
      photo: '/placeholder.svg',
      shotMap: { 'top-left': 0, 'top-center': 1, 'top-right': 1, 'middle-left': 1, 'middle-center': 0, 'middle-right': 0, 'bottom-left': 0, 'bottom-center': 0, 'bottom-right': 0 }
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
      saves: 15,
      photo: '/placeholder.svg',
      shotMap: { 'top-left': 0, 'top-center': 0, 'top-right': 0, 'middle-left': 0, 'middle-center': 0, 'middle-right': 0, 'bottom-left': 0, 'bottom-center': 0, 'bottom-right': 0 }
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
      crosses: 8,
      photo: '/placeholder.svg',
      shotMap: { 'top-left': 0, 'top-center': 0, 'top-right': 0, 'middle-left': 0, 'middle-center': 1, 'middle-right': 0, 'bottom-left': 0, 'bottom-center': 0, 'bottom-right': 0 }
    }
  ];

  const [showMoreStats, setShowMoreStats] = useState(false);

  const renderPlayerDetail = () => {
    if (!selectedPlayer) return null;

    // Datos de performance simulados por partido (últimos 5 partidos)
    const performanceData = [
      { match: 'vs Real', date: '12 Ene', score: 85 },
      { match: 'vs Barcelona', date: '17 Ene', score: 92 },
      { match: 'vs Atlético', date: '25 Ene', score: 78 },
      { match: 'vs Valencia', date: '29 Ene', score: 88 },
      { match: 'vs Sevilla', date: '4 Feb', score: 95 }
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

        {/* Main Layout: Three Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Player Info */}
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Player Photo */}
              <div className="relative">
                {selectedPlayer.photo ? (
                  <img 
                    src={selectedPlayer.photo} 
                    alt={selectedPlayer.name}
                    className="w-32 h-32 rounded-lg object-cover border-4 border-primary"
                  />
                ) : (
                  <div className="w-32 h-32 bg-primary rounded-lg flex items-center justify-center text-white text-4xl font-bold">
                    {selectedPlayer.number}
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-primary flex items-center justify-center hover:bg-gray-50 shadow-lg">
                  <Camera className="w-4 h-4 text-primary" />
                </button>
              </div>

              {/* Player Basic Info */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{selectedPlayer.name}</h1>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {selectedPlayer.position}
                </span>
              </div>

              {/* Key Stats */}
              <div className="w-full space-y-3 mt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Partidos jugados</span>
                  <span className="font-bold text-lg">{selectedPlayer.games}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goles</span>
                  <span className="font-bold text-lg text-green-600">{selectedPlayer.goals}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Center Column: Performance Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="match" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value} pts`, 'Puntuación']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${payload[0].payload.match} - ${payload[0].payload.date}`;
                    }
                    return label;
                  }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Right Column: Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            
            {/* Main 6 Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Minutos jugados
                </span>
                <span className="font-semibold">{selectedPlayer.minutes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Tiros a portería
                </span>
                <span className="font-semibold">{selectedPlayer.shotsOnTarget}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Tiros fuera
                </span>
                <span className="font-semibold">{selectedPlayer.shots - selectedPlayer.shotsOnTarget}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Precisión de pases</span>
                <span className="font-semibold">{selectedPlayer.passAccuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Faltas cometidas</span>
                <span className="font-semibold">{selectedPlayer.foulsCommitted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Faltas recibidas</span>
                <span className="font-semibold">{selectedPlayer.foulsReceived}</span>
              </div>
            </div>

            {/* Show More Button */}
            <Button
              variant="outline"
              onClick={() => setShowMoreStats(!showMoreStats)}
              className="w-full mt-4 text-sm"
            >
              {showMoreStats ? 'Mostrar menos' : 'Ver más estadísticas'}
            </Button>

            {/* Additional Stats (Collapsible) */}
            {showMoreStats && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Balones perdidos</span>
                  <span className="font-semibold">{selectedPlayer.ballsLost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balones recuperados</span>
                  <span className="font-semibold">{selectedPlayer.ballsRecovered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duelos ganados</span>
                  <span className="font-semibold">{selectedPlayer.duelsWon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duelos perdidos</span>
                  <span className="font-semibold">{selectedPlayer.duelsLost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Centros</span>
                  <span className="font-semibold">{selectedPlayer.crosses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarjetas amarillas</span>
                  <span className="font-semibold">{selectedPlayer.yellowCards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarjetas rojas</span>
                  <span className="font-semibold">{selectedPlayer.redCards}</span>
                </div>
                {selectedPlayer.saves !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paradas</span>
                    <span className="font-semibold">{selectedPlayer.saves}</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Bottom Center: Shot Map */}
        {selectedPlayer.shotMap && (
          <div className="flex justify-center">
            <Card className="p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold mb-4 text-center">Mapa de Disparos</h3>
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-3 w-80 h-60 bg-green-50 border-4 border-gray-400 rounded-lg p-4">
                  {['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((zone, index) => (
                    <div
                      key={zone}
                      className="bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold text-gray-800 hover:bg-primary/5 transition-colors shadow-sm"
                    >
                      {selectedPlayer.shotMap?.[zone] || 0}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Número de goles marcados por zona de la portería
              </p>
            </Card>
          </div>
        )}
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
              <div className="relative">
                {player.photo ? (
                  <img 
                    src={player.photo} 
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {player.number}
                  </div>
                )}
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