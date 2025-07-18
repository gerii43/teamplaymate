import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

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

const Matches = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
        </div>

        {/* Match Header */}
        <div className="bg-white rounded-lg shadow p-6">
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
        </div>

        {/* Match Statistics */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Primera Parte */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Primera Parte</h3>
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
          </div>

          {/* Segunda Parte */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Segunda Parte</h3>
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
          </div>
        </div>
      </div>
    );
  };

  const renderMatchList = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Partidos</h1>
      
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            onClick={() => setSelectedMatch(match)}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
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
          </div>
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