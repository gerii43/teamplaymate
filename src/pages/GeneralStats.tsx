import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, Target, Users, Award, TrendingUp, Activity } from 'lucide-react';

const GeneralStats = () => {
  // Mock data for general statistics
  const teamStats = {
    totalMatches: 12,
    goalsFor: 36,
    goalsAgainst: 18,
    totalAssists: 24,
    foulsCommitted: 45,
    foulsReceived: 52,
    winPercentage: 66.7,
    wins: 8,
    draws: 2,
    losses: 2
  };

  const performanceData = [
    { month: 'Sep', wins: 2, goals: 8, assists: 6 },
    { month: 'Oct', wins: 3, goals: 12, assists: 9 },
    { month: 'Nov', wins: 2, goals: 10, assists: 6 },
    { month: 'Dec', wins: 1, goals: 6, assists: 3 },
  ];

  const positionStats = [
    { position: 'Delantero', players: 4, goals: 20, assists: 8 },
    { position: 'Centrocampista', players: 6, goals: 12, assists: 14 },
    { position: 'Defensa', players: 5, goals: 3, assists: 2 },
    { position: 'Portero', players: 2, goals: 1, assists: 0 },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas Generales</h1>
          <div className="text-sm text-gray-500">Temporada 2024/25</div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Partidos</p>
                  <p className="text-3xl font-bold text-gray-900">{teamStats.totalMatches}</p>
                </div>
                <Trophy className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Goles a Favor</p>
                  <p className="text-3xl font-bold text-gray-900">{teamStats.goalsFor}</p>
                </div>
                <Target className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Goles en Contra</p>
                  <p className="text-3xl font-bold text-gray-900">{teamStats.goalsAgainst}</p>
                </div>
                <Activity className="h-12 w-12 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">% Victorias</p>
                  <p className="text-3xl font-bold text-gray-900">{teamStats.winPercentage}%</p>
                </div>
                <Award className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">Asistencias Totales</p>
                <p className="text-4xl font-bold text-blue-600">{teamStats.totalAssists}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">Faltas Cometidas</p>
                <p className="text-4xl font-bold text-red-600">{teamStats.foulsCommitted}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">Faltas Recibidas</p>
                <p className="text-4xl font-bold text-green-600">{teamStats.foulsReceived}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rendimiento Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="wins" stroke="#3b82f6" strokeWidth={3} name="Victorias" />
                <Line type="monotone" dataKey="goals" stroke="#10b981" strokeWidth={3} name="Goles" />
                <Line type="monotone" dataKey="assists" stroke="#8b5cf6" strokeWidth={3} name="Asistencias" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Position Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Estadísticas por Posición
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="goals" fill="#3b82f6" name="Goles" />
                <Bar dataKey="assists" fill="#10b981" name="Asistencias" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GeneralStats;