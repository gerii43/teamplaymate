import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Users, Calendar, TrendingUp } from 'lucide-react';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  
  // Mock attendance data
  const players = [
    { id: 1, name: 'Juan García', position: 'Delantero', attendance: 'present', number: 10 },
    { id: 2, name: 'Carlos López', position: 'Centrocampista', attendance: 'absent', number: 8 },
    { id: 3, name: 'Miguel Rodríguez', position: 'Defensa', attendance: 'justified', number: 4 },
    { id: 4, name: 'Antonio Martín', position: 'Portero', attendance: 'present', number: 1 },
    { id: 5, name: 'David Fernández', position: 'Delantero', attendance: 'present', number: 9 },
    { id: 6, name: 'Luis Sánchez', position: 'Centrocampista', attendance: 'present', number: 6 },
    { id: 7, name: 'Pedro Jiménez', position: 'Defensa', attendance: 'absent', number: 3 },
    { id: 8, name: 'Francisco Ruiz', position: 'Defensa', attendance: 'present', number: 2 },
  ];

  const attendanceStats = [
    { name: 'Juan García', present: 10, absent: 1, justified: 1, percentage: 91.7 },
    { name: 'Carlos López', present: 8, absent: 3, justified: 1, percentage: 75.0 },
    { name: 'Miguel Rodríguez', present: 9, absent: 1, justified: 2, percentage: 91.7 },
    { name: 'Antonio Martín', present: 11, absent: 0, justified: 1, percentage: 100.0 },
    { name: 'David Fernández', present: 10, absent: 2, justified: 0, percentage: 83.3 },
    { name: 'Luis Sánchez', present: 9, absent: 2, justified: 1, percentage: 83.3 },
    { name: 'Pedro Jiménez', present: 7, absent: 4, justified: 1, percentage: 66.7 },
    { name: 'Francisco Ruiz', present: 11, absent: 1, justified: 0, percentage: 91.7 },
  ];

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Presente</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Ausente</Badge>;
      case 'justified':
        return <Badge className="bg-yellow-100 text-yellow-800">Justificado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Sin datos</Badge>;
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const presentCount = players.filter(p => p.attendance === 'present').length;
  const absentCount = players.filter(p => p.attendance === 'absent').length;
  const justifiedCount = players.filter(p => p.attendance === 'justified').length;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Control de Asistencia</h1>
          <div className="text-sm text-gray-500">Entrenamiento: {selectedDate}</div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jugadores</p>
                  <p className="text-3xl font-bold text-gray-900">{players.length}</p>
                </div>
                <Users className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Presentes</p>
                  <p className="text-3xl font-bold text-gray-900">{presentCount}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ausentes</p>
                  <p className="text-3xl font-bold text-gray-900">{absentCount}</p>
                </div>
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Justificados</p>
                  <p className="text-3xl font-bold text-gray-900">{justifiedCount}</p>
                </div>
                <Clock className="h-12 w-12 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList>
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hoy
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Asistencia - {selectedDate}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                          {player.number}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{player.name}</p>
                          <p className="text-sm text-gray-500">{player.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getAttendanceBadge(player.attendance)}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Asistencia - Temporada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Jugador</th>
                        <th className="text-center p-2">Presente</th>
                        <th className="text-center p-2">Ausente</th>
                        <th className="text-center p-2">Justificado</th>
                        <th className="text-center p-2">% Asistencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceStats.map((stat, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{stat.name}</td>
                          <td className="text-center p-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {stat.present}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                              {stat.absent}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              {stat.justified}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className={`font-bold text-lg ${getPercentageColor(stat.percentage)}`}>
                              {stat.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Attendance;