import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, MapPin, Download, Copy, Trophy, Target, Award } from 'lucide-react';

interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  venue: string;
  status: 'completed' | 'upcoming';
}

interface MatchStats {
  firstHalf: {
    goals: number;
    assists: number;
    shots: number;
    shotsOff: number;
    foulsCommitted: number;
    foulsReceived: number;
    ballsLost: number;
    ballsRecovered: number;
    duelsWon: number;
    duelsLost: number;
    saves: number;
    possession: number;
  };
  secondHalf: {
    goals: number;
    assists: number;
    shots: number;
    shotsOff: number;
    foulsCommitted: number;
    foulsReceived: number;
    ballsLost: number;
    ballsRecovered: number;
    duelsWon: number;
    duelsLost: number;
    saves: number;
    possession: number;
  };
}

interface MatchPlayer {
  id: string;
  name: string;
  number: number;
  goals: number;
  assists: number;
  mvpRating?: number;
  photo?: string;
}

const Matches = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  const matches: Match[] = [
    {
      id: '1',
      date: '2024-07-15',
      homeTeam: 'CD Statsor',
      awayTeam: 'Jaén FC',
      homeScore: 5,
      awayScore: 3,
      venue: 'Pabellón Municipal',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-07-08',
      homeTeam: 'Valencia CF',
      awayTeam: 'CD Statsor',
      homeScore: 2,
      awayScore: 4,
      venue: 'Estadio Mestalla',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-07-22',
      homeTeam: 'CD Statsor',
      awayTeam: 'Real Madrid',
      homeScore: 0,
      awayScore: 0,
      venue: 'Pabellón Municipal',
      status: 'upcoming'
    }
  ];

  const mockMatchStats: MatchStats = {
    firstHalf: {
      goals: 3,
      assists: 2,
      shots: 8,
      shotsOff: 4,
      foulsCommitted: 5,
      foulsReceived: 3,
      ballsLost: 12,
      ballsRecovered: 15,
      duelsWon: 18,
      duelsLost: 10,
      saves: 4,
      possession: 58
    },
    secondHalf: {
      goals: 2,
      assists: 1,
      shots: 6,
      shotsOff: 3,
      foulsCommitted: 3,
      foulsReceived: 2,
      ballsLost: 8,
      ballsRecovered: 12,
      duelsWon: 14,
      duelsLost: 8,
      saves: 2,
      possession: 62
    }
  };

  const matchPlayers: MatchPlayer[] = [
    {
      id: '1',
      name: 'Carlos López',
      number: 10,
      goals: 2,
      assists: 1,
      mvpRating: 9.2
    },
    {
      id: '2',
      name: 'Miguel Rodríguez',
      number: 7,
      goals: 2,
      assists: 0,
      mvpRating: 8.5
    },
    {
      id: '3',
      name: 'Pablo Sánchez',
      number: 8,
      goals: 1,
      assists: 2,
      mvpRating: 8.7
    },
    {
      id: '4',
      name: 'Juan Pérez',
      number: 11,
      goals: 0,
      assists: 1,
      mvpRating: 7.8
    }
  ].sort((a, b) => (b.goals * 2 + b.assists) - (a.goals * 2 + a.assists));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const generateMatchSummary = () => {
    if (!selectedMatch) return '';

    const totalGoals = mockMatchStats.firstHalf.goals + mockMatchStats.secondHalf.goals;
    const totalAssists = mockMatchStats.firstHalf.assists + mockMatchStats.secondHalf.assists;
    const mvpPlayer = matchPlayers[0];
    
    const goalScorers = matchPlayers
      .filter(player => player.goals > 0)
      .map(player => `${player.name} (${player.goals} ${player.goals === 1 ? 'gol' : 'goles'})`)
      .join(', ');

    const assistProviders = matchPlayers
      .filter(player => player.assists > 0)
      .map(player => `${player.name} (${player.assists} ${player.assists === 1 ? 'asistencia' : 'asistencias'})`)
      .join(', ');

    return `El equipo ${selectedMatch.homeTeam} ${selectedMatch.homeScore > selectedMatch.awayScore ? 'ganó' : selectedMatch.homeScore < selectedMatch.awayScore ? 'perdió' : 'empató'} ${selectedMatch.homeScore}-${selectedMatch.awayScore} frente a ${selectedMatch.awayTeam}. 

En la primera parte se marcaron ${mockMatchStats.firstHalf.goals} goles y se realizaron ${mockMatchStats.firstHalf.assists} asistencias. En la segunda parte fueron ${mockMatchStats.secondHalf.goals} goles y ${mockMatchStats.secondHalf.assists} asistencias.

${goalScorers ? `Goleadores: ${goalScorers}.` : ''} ${assistProviders ? `Asistencias: ${assistProviders}.` : ''}

El jugador más destacado fue ${mvpPlayer.name} con ${mvpPlayer.goals} ${mvpPlayer.goals === 1 ? 'gol' : 'goles'} y ${mvpPlayer.assists} ${mvpPlayer.assists === 1 ? 'asistencia' : 'asistencias'} (Nota: ${mvpPlayer.mvpRating}).`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMatchSummary());
    // Aquí podrías añadir un toast de confirmación
  };

  const downloadPDF = () => {
    const summary = generateMatchSummary();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen-partido-${selectedMatch?.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMatchDetail = () => {
    if (!selectedMatch) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSelectedMatch(null)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Partidos</span>
          </Button>
          
          <Button
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Award className="w-4 h-4" />
            <span>Generar Resumen</span>
          </Button>
        </div>

        {/* Match Header */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
              </h2>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {selectedMatch.homeScore} - {selectedMatch.awayScore}
              </div>
              <div className="flex items-center justify-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedMatch.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedMatch.venue}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jugadores Destacados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Jugadores Destacados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {matchPlayers.slice(0, 4).map((player) => (
                <div
                  key={player.id}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold text-gray-600">
                    {player.number}
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{player.name}</h4>
                  <div className="flex justify-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <Target className="w-3 h-3 text-green-600" />
                      <span>{player.goals}G</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-3 h-3 text-blue-600" />
                      <span>{player.assists}A</span>
                    </div>
                  </div>
                  {player.mvpRating && (
                    <div className="mt-2 text-xs font-semibold text-yellow-600">
                      ★ {player.mvpRating}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen del Partido */}
        {showSummary && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resumen del Partido</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </Button>
                  <Button
                    onClick={downloadPDF}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {generateMatchSummary()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Match Statistics */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Primera Parte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Primera Parte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Goles</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.goals}</span>
                </div>
                <div className="flex justify-between">
                  <span>Asistencias</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.assists}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiros a portería</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.shots}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiros fuera</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.shotsOff}</span>
                </div>
                <div className="flex justify-between">
                  <span>Faltas cometidas</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.foulsCommitted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Faltas recibidas</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.foulsReceived}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balones perdidos</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.ballsLost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balones recuperados</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.ballsRecovered}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duelos ganados / perdidos</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.duelsWon} / {mockMatchStats.firstHalf.duelsLost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paradas (portero)</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.saves}</span>
                </div>
                <div className="flex justify-between">
                  <span>Posesión (%)</span>
                  <span className="font-semibold">{mockMatchStats.firstHalf.possession}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segunda Parte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Segunda Parte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Goles</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.goals}</span>
                </div>
                <div className="flex justify-between">
                  <span>Asistencias</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.assists}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiros a portería</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.shots}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiros fuera</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.shotsOff}</span>
                </div>
                <div className="flex justify-between">
                  <span>Faltas cometidas</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.foulsCommitted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Faltas recibidas</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.foulsReceived}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balones perdidos</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.ballsLost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balones recuperados</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.ballsRecovered}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duelos ganados / perdidos</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.duelsWon} / {mockMatchStats.secondHalf.duelsLost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paradas (portero)</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.saves}</span>
                </div>
                <div className="flex justify-between">
                  <span>Posesión (%)</span>
                  <span className="font-semibold">{mockMatchStats.secondHalf.possession}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderMatchList = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Partidos</h1>
      
      <div className="space-y-4">
        {matches.map((match) => (
          <Card
            key={match.id}
            onClick={() => setSelectedMatch(match)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(match.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{match.venue}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  match.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {match.status === 'completed' ? 'Finalizado' : 'Próximo'}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold">
                  {match.homeTeam} vs {match.awayTeam}
                </h3>
                {match.status === 'completed' && (
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    {match.homeScore} - {match.awayScore}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6">
        {selectedMatch ? renderMatchDetail() : renderMatchList()}
      </div>
    </Layout>
  );
};

export default Matches;
