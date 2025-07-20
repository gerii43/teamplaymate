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

    // Datos de performance simulados por partido (últimos partidos)
    const performanceData = [
      { match: 'vs Real', date: '12 Dic', score: 85, rival: 'Real Madrid' },
      { match: 'vs Arsenal', date: '17 Dic', score: 92, rival: 'Arsenal' },
      { match: 'vs Wolves', date: '25 Dic', score: 78, rival: 'Wolverhampton' },
      { match: 'vs West Ham', date: '29 Dic', score: 88, rival: 'West Ham' },
      { match: 'vs Aston Villa', date: '4 Ene', score: 68, rival: 'Aston Villa' },
      { match: 'vs Brighton', date: '8 Ene', score: 85, rival: 'Brighton' },
      { match: 'vs Fulham', date: '15 Ene', score: 95, rival: 'Fulham' },
      { match: 'vs Man City', date: '29 Ene', score: 55, rival: 'Manchester City' },
      { match: 'vs Everton', date: '6 Feb', score: 88, rival: 'Everton' },
      { match: 'vs Sheffield', date: '17 Feb', score: 95, rival: 'Sheffield United' },
      { match: 'vs Chelsea', date: '24 Feb', score: 68, rival: 'Chelsea' }
    ];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSelectedPlayer(null)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al equipo</span>
          </Button>
        </div>

        {/* Main Layout: Following exact 4-card structure from reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          
          {/* LEFT: Player Card (Tall, reaches bottom) */}
          <div className="lg:col-span-4 h-full">
            <Card className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-full">
              <div className="flex flex-col space-y-6 h-full">
                {/* Player Photo */}
                <div className="relative mx-auto">
                  {selectedPlayer.photo ? (
                    <img 
                      src={selectedPlayer.photo} 
                      alt={selectedPlayer.name}
                      className="w-48 h-48 rounded-xl object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white text-6xl font-bold border-4 border-white/20">
                      {selectedPlayer.number}
                    </div>
                  )}
                  <button className="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center hover:bg-blue-700 shadow-lg transition-colors">
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Player Name & Position */}
                <div className="text-center space-y-3">
                  <h1 className="text-3xl font-bold">{selectedPlayer.name}</h1>
                  <div className="flex items-center justify-center space-x-4 text-white/80">
                    <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                    <span className="text-lg font-medium">{selectedPlayer.position}</span>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="space-y-4 pt-4 border-t border-white/20 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Posición</span>
                    <span className="font-bold text-lg">{selectedPlayer.position}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Partidos jugados</span>
                    <span className="font-bold text-lg">{selectedPlayer.games}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Goles</span>
                    <span className="font-bold text-lg text-green-400">{selectedPlayer.goals}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE: Two rows */}
          <div className="lg:col-span-8 h-full flex flex-col gap-6">
            
            {/* TOP RIGHT: Performance Chart (Wide) */}
            <div className="h-1/2">
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Performance</h3>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                      Todo
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
                      En casa
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
                      Fuera
                    </button>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height="calc(100% - 80px)">
                  <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} pts`, 'Puntuación']}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          const data = payload[0].payload;
                          return `${data.rival} - ${data.date}`;
                        }
                        return label;
                      }}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* BOTTOM RIGHT: Two cards side by side */}
            <div className="h-1/2 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* BOTTOM LEFT: Statistics */}
              <Card className="p-6 h-full overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6">Estadísticas</h3>
                
                {/* Main 6 Stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-600">Minutos jugados</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPlayer.minutes}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-600">Tiros a portería</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPlayer.shotsOnTarget}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-gray-600">Tiros fuera</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPlayer.shots - selectedPlayer.shotsOnTarget}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-gray-600">Precisión de pases</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPlayer.passAccuracy}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-gray-600">Faltas cometidas</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPlayer.foulsCommitted}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-gray-600">Faltas recibidas</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPlayer.foulsReceived}</span>
                  </div>
                </div>

                {/* Show More Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowMoreStats(!showMoreStats)}
                  className="w-full mt-6 border-gray-300 hover:bg-gray-50"
                >
                  {showMoreStats ? 'Mostrar menos estadísticas' : 'Ver más estadísticas'}
                </Button>

                {/* Additional Stats (Collapsible) */}
                {showMoreStats && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Balones perdidos</span>
                      <span className="font-bold">{selectedPlayer.ballsLost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Balones recuperados</span>
                      <span className="font-bold">{selectedPlayer.ballsRecovered}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duelos ganados</span>
                      <span className="font-bold">{selectedPlayer.duelsWon}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duelos perdidos</span>
                      <span className="font-bold">{selectedPlayer.duelsLost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Centros</span>
                      <span className="font-bold">{selectedPlayer.crosses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tarjetas amarillas</span>
                      <span className="font-bold text-yellow-600">{selectedPlayer.yellowCards}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tarjetas rojas</span>
                      <span className="font-bold text-red-600">{selectedPlayer.redCards}</span>
                    </div>
                    {selectedPlayer.saves !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Paradas</span>
                        <span className="font-bold">{selectedPlayer.saves}</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* BOTTOM RIGHT: Shot Map */}
              {selectedPlayer.shotMap && (
                <Card className="p-6 h-full">
                  <h3 className="text-xl font-bold mb-4 text-center">Mapa de Disparos</h3>
                  <div className="flex justify-center h-full items-center">
                    <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] aspect-square bg-gradient-to-b from-green-100 to-green-200 border-4 border-gray-700 rounded-xl p-4 shadow-lg">
                      {['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((zone, index) => (
                        <div
                          key={zone}
                          className="bg-white/80 backdrop-blur-sm border-2 border-gray-400 rounded-lg flex items-center justify-center text-xl font-bold text-gray-800 hover:bg-white hover:scale-105 transition-all duration-200 shadow-md"
                        >
                          {selectedPlayer.shotMap?.[zone] || 0}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-gray-600 mt-4 text-sm">
                    Goles por zona de la portería
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
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