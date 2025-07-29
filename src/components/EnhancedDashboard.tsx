import React from 'react';
import { useSport } from '@/contexts/SportContext';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, Target, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
const EnhancedDashboard = () => {
  const { t } = useLanguage();
  const { sport } = useSport();
  
  // Mock data for performance charts
  const performanceData = [
    { name: 'Partido 1', puntos: 3, golesF: 2, golesC: 1, victorias: 100 },
    { name: 'Partido 2', puntos: 1, golesF: 1, golesC: 1, victorias: 50 },
    { name: 'Partido 3', puntos: 3, golesF: 3, golesC: 0, victorias: 100 },
    { name: 'Partido 4', puntos: 0, golesF: 0, golesC: 2, victorias: 0 },
    { name: 'Partido 5', puntos: 3, golesF: 4, golesC: 1, victorias: 100 },
    { name: 'Partido 6', puntos: 3, golesF: 2, golesC: 0, victorias: 100 },
  ];

  // Mock data for top 5 players
  const topPlayers = [
    { 
      jugador: 'Fernando Torres', 
      posicion: 'DEL', 
      minutos: 480, 
      goles: 5, 
      asistencias: 3, 
      faltasRecibidas: 8, 
      tiros: 12, 
      tarjetasAmarillas: 0, 
      faltasCometidas: 2 
    },
    { 
      jugador: 'Pablo Sánchez', 
      posicion: 'CEN', 
      minutos: 465, 
      goles: 2, 
      asistencias: 6, 
      faltasRecibidas: 5, 
      tiros: 8, 
      tarjetasAmarillas: 2, 
      faltasCometidas: 4 
    },
    { 
      jugador: 'Juan Pérez', 
      posicion: 'DEL', 
      minutos: 420, 
      goles: 3, 
      asistencias: 2, 
      faltasRecibidas: 6, 
      tiros: 10, 
      tarjetasAmarillas: 1, 
      faltasCometidas: 3 
    },
    { 
      jugador: 'Miguel Rodríguez', 
      posicion: 'CEN', 
      minutos: 390, 
      goles: 1, 
      asistencias: 4, 
      faltasRecibidas: 3, 
      tiros: 6, 
      tarjetasAmarillas: 2, 
      faltasCometidas: 5 
    },
    { 
      jugador: 'David González', 
      posicion: 'DEF', 
      minutos: 480, 
      goles: 1, 
      asistencias: 0, 
      faltasRecibidas: 2, 
      tiros: 3, 
      tarjetasAmarillas: 1, 
      faltasCometidas: 8 
    },
  ];

  // Mock data for upcoming matches
  const upcomingMatches = [
    {
      fecha: '25 Julio 2025',
      equipos: 'CD Statsor vs Jaén FS',
      lugar: 'Pabellón Municipal'
    },
    {
      fecha: '1 Agosto 2025',
      equipos: 'Córdoba CF vs CD Statsor',
      lugar: 'Estadio Córdoba'
    },
    {
      fecha: '8 Agosto 2025',
      equipos: 'CD Statsor vs Málaga FS',
      lugar: 'Pabellón Municipal'
    },
    {
      fecha: '15 Agosto 2025',
      equipos: 'Sevilla FC vs CD Statsor',
      lugar: 'Estadio Sevilla'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">{t('dashboard.points')}</p>
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm text-blue-100">Temporada actual</p>
            </div>
            <Trophy className="w-12 h-12 text-blue-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Último Resultado</p>
              <p className="text-lg font-bold">CD Statsor 5-3 Jaén</p>
              <p className="text-sm text-green-100">hace 3 días</p>
            </div>
            <Target className="w-12 h-12 text-green-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">% {t('dashboard.victories')}</p>
              <p className="text-3xl font-bold">66.7%</p>
              <p className="text-sm text-purple-100">8 de 12 partidos</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">{t('dashboard.current.season')} - Jaén</p>
              <p className="text-sm text-orange-100">{t('dashboard.days.ago').replace('{days}', '3')}</p>
              <p className="text-sm text-orange-100">{t('dashboard.matches.of').replace('{current}', '8').replace('{total}', '12')}</p>
              <p className="text-sm text-orange-100">{t('dashboard.team.division').replace('{division}', 'Primera División')}</p>
            </div>
            <Users className="w-12 h-12 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Middle Row - Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Team Evolution Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('dashboard.team.evolution')}</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="puntos" stroke="#3b82f6" name={t('dashboard.points')} strokeWidth={2} />
              <Line type="monotone" dataKey="golesF" stroke="#10b981" name={t('dashboard.goals.for')} strokeWidth={2} />
              <Line type="monotone" dataKey="golesC" stroke="#ef4444" name={t('dashboard.goals.against')} strokeWidth={2} />
              <Line type="monotone" dataKey="victorias" stroke="#8b5cf6" name={`% ${t('dashboard.victories')}`} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Right Column - Top 5 Players */}
        <Card className="p-6 h-full">
          <h3 className="text-lg font-semibold mb-4">{t('dashboard.top.players')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t('dashboard.player')}</th>
                  <th className="text-left p-2">Pos</th>
                  <th className="text-left p-2">Min</th>
                  <th className="text-left p-2">{t('players.goals')}</th>
                  <th className="text-left p-2">{t('players.assists')}</th>
                  <th className="text-left p-2">Flt</th>
                  <th className="text-left p-2">{t('dashboard.shots')}</th>
                  <th className="text-left p-2">Tarj</th>
                  <th className="text-left p-2">Flt Com</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{player.jugador}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {player.posicion}
                      </span>
                    </td>
                    <td className="p-2">{player.minutos}</td>
                    <td className="p-2 font-semibold text-green-600">{player.goles}</td>
                    <td className="p-2 font-semibold text-blue-600">{player.asistencias}</td>
                    <td className="p-2">{player.faltasRecibidas}</td>
                    <td className="p-2">{player.tiros}</td>
                    <td className="p-2">
                      {player.tarjetasAmarillas > 0 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          {player.tarjetasAmarillas}
                        </span>
                      )}
                    </td>
                    <td className="p-2">{player.faltasCometidas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Bottom Row - Upcoming Matches */}
      <Card className="p-6 mt-4">
        <h3 className="text-lg font-semibold mb-4">Próximos Partidos</h3>
        <div className="space-y-4">
          {upcomingMatches.map((match, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
              <div className="text-sm font-semibold text-gray-600 mb-2">{match.fecha}</div>
              <div className="font-medium text-gray-900 mb-2">{match.equipos}</div>
              <div className="text-sm text-gray-500">{match.lugar}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export default EnhancedDashboard;