import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, XCircle, Clock, Users, Calendar, Plus, ChevronDown, ChevronRight, TrendingUp, History, Trophy, Target, Award, Filter } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  attendance: 'present' | 'absent' | 'justified' | 'pending';
}

interface Training {
  id: number;
  date: string;
  time: string;
  status: 'completed' | 'in-progress' | 'pending';
  players: Player[];
}

type ViewMode = 'future' | 'past' | 'historic';
type HistoricFilter = 'all' | 'last-month' | 'last-3-months' | 'season';
type PositionFilter = 'all' | 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';

const Attendance = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('future');
  const [historicFilter, setHistoricFilter] = useState<HistoricFilter>('all');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('all');
  
  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: 1,
      date: '2024-01-15',
      time: '18:30',
      status: 'completed',
      players: [
        { id: 1, name: 'Juan García', position: 'Delantero', attendance: 'present', number: 10 },
        { id: 2, name: 'Carlos López', position: 'Centrocampista', attendance: 'absent', number: 8 },
        { id: 3, name: 'Miguel Rodríguez', position: 'Defensa', attendance: 'justified', number: 4 },
        { id: 4, name: 'Antonio Martín', position: 'Portero', attendance: 'present', number: 1 },
        { id: 5, name: 'David Fernández', position: 'Delantero', attendance: 'present', number: 9 },
        { id: 6, name: 'Luis Sánchez', position: 'Centrocampista', attendance: 'present', number: 6 },
        { id: 7, name: 'Pedro Jiménez', position: 'Defensa', attendance: 'absent', number: 3 },
        { id: 8, name: 'Francisco Ruiz', position: 'Defensa', attendance: 'present', number: 2 },
      ]
    },
    {
      id: 2,
      date: '2024-07-25',
      time: '19:00',
      status: 'pending',
      players: [
        { id: 1, name: 'Juan García', position: 'Delantero', attendance: 'pending', number: 10 },
        { id: 2, name: 'Carlos López', position: 'Centrocampista', attendance: 'pending', number: 8 },
        { id: 3, name: 'Miguel Rodríguez', position: 'Defensa', attendance: 'pending', number: 4 },
        { id: 4, name: 'Antonio Martín', position: 'Portero', attendance: 'pending', number: 1 },
        { id: 5, name: 'David Fernández', position: 'Delantero', attendance: 'pending', number: 9 },
        { id: 6, name: 'Luis Sánchez', position: 'Centrocampista', attendance: 'pending', number: 6 },
        { id: 7, name: 'Pedro Jiménez', position: 'Defensa', attendance: 'pending', number: 3 },
        { id: 8, name: 'Francisco Ruiz', position: 'Defensa', attendance: 'pending', number: 2 },
      ]
    },
    {
      id: 3,
      date: '2024-07-27',
      time: '18:30',
      status: 'in-progress',
      players: [
        { id: 1, name: 'Juan García', position: 'Delantero', attendance: 'present', number: 10 },
        { id: 2, name: 'Carlos López', position: 'Centrocampista', attendance: 'present', number: 8 },
        { id: 3, name: 'Miguel Rodríguez', position: 'Defensa', attendance: 'present', number: 4 },
        { id: 4, name: 'Antonio Martín', position: 'Portero', attendance: 'present', number: 1 },
        { id: 5, name: 'David Fernández', position: 'Delantero', attendance: 'pending', number: 9 },
        { id: 6, name: 'Luis Sánchez', position: 'Centrocampista', attendance: 'pending', number: 6 },
        { id: 7, name: 'Pedro Jiménez', position: 'Defensa', attendance: 'pending', number: 3 },
        { id: 8, name: 'Francisco Ruiz', position: 'Defensa', attendance: 'pending', number: 2 },
      ]
    }
  ]);

  const [openTraining, setOpenTraining] = useState<number | null>(null);

  const addNewTraining = () => {
    const newTraining: Training = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: '18:30',
      status: 'pending',
      players: [
        { id: 1, name: 'Juan García', position: 'Delantero', attendance: 'pending', number: 10 },
        { id: 2, name: 'Carlos López', position: 'Centrocampista', attendance: 'pending', number: 8 },
        { id: 3, name: 'Miguel Rodríguez', position: 'Defensa', attendance: 'pending', number: 4 },
        { id: 4, name: 'Antonio Martín', position: 'Portero', attendance: 'pending', number: 1 },
        { id: 5, name: 'David Fernández', position: 'Delantero', attendance: 'pending', number: 9 },
        { id: 6, name: 'Luis Sánchez', position: 'Centrocampista', attendance: 'pending', number: 6 },
        { id: 7, name: 'Pedro Jiménez', position: 'Defensa', attendance: 'pending', number: 3 },
        { id: 8, name: 'Francisco Ruiz', position: 'Defensa', attendance: 'pending', number: 2 },
      ]
    };
    setTrainings(prev => [newTraining, ...prev]);
    setOpenTraining(newTraining.id);
  };

  const updatePlayerAttendance = (trainingId: number, playerId: number, newStatus: 'present' | 'absent' | 'justified') => {
    setTrainings(prev => prev.map(training => {
      if (training.id === trainingId) {
        const updatedPlayers = training.players.map(player => 
          player.id === playerId ? { ...player, attendance: newStatus } : player
        );
        
        const pendingCount = updatedPlayers.filter(p => p.attendance === 'pending').length;
        let status: 'completed' | 'in-progress' | 'pending';
        
        if (pendingCount === 0) {
          status = 'completed';
        } else if (pendingCount < updatedPlayers.length) {
          status = 'in-progress';
        } else {
          status = 'pending';
        }
        
        return {
          ...training,
          players: updatedPlayers,
          status
        };
      }
      return training;
    }));
  };

  const filterTrainings = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (viewMode === 'future') {
      return trainings.filter(training => training.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    } else if (viewMode === 'past') {
      return trainings.filter(training => training.date < today).sort((a, b) => b.date.localeCompare(a.date));
    }
    return [];
  };

  const getFilteredHistoricData = () => {
    const playerStats: { [key: number]: { name: string; position: string; number: number; present: number; absent: number; justified: number; total: number; lastAbsence?: string; consecutivePresent: number } } = {};
    
    let filteredTrainings = trainings.filter(training => training.status === 'completed');
    
    if (historicFilter !== 'all') {
      const today = new Date();
      let filterDate = new Date();
      
      switch (historicFilter) {
        case 'last-month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        case 'last-3-months':
          filterDate.setMonth(today.getMonth() - 3);
          break;
        case 'season':
          filterDate.setMonth(8);
          if (today.getMonth() < 8) {
            filterDate.setFullYear(today.getFullYear() - 1);
          }
          break;
      }
      
      filteredTrainings = filteredTrainings.filter(training => 
        new Date(training.date) >= filterDate
      );
    }
    
    filteredTrainings.forEach(training => {
      training.players.forEach(player => {
        if (!playerStats[player.id]) {
          playerStats[player.id] = {
            name: player.name,
            position: player.position,
            number: player.number,
            present: 0,
            absent: 0,
            justified: 0,
            total: 0,
            consecutivePresent: 0
          };
        }
        
        if (player.attendance !== 'pending') {
          playerStats[player.id].total++;
          if (player.attendance === 'present') {
            playerStats[player.id].present++;
            playerStats[player.id].consecutivePresent++;
          } else {
            playerStats[player.id].consecutivePresent = 0;
            if (player.attendance === 'absent') {
              playerStats[player.id].absent++;
              playerStats[player.id].lastAbsence = training.date;
            }
            if (player.attendance === 'justified') {
              playerStats[player.id].justified++;
            }
          }
        }
      });
    });
    
    let filteredStats = Object.values(playerStats).filter(player => player.total > 0);
    
    if (positionFilter !== 'all') {
      filteredStats = filteredStats.filter(player => player.position === positionFilter);
    }
    
    return filteredStats.sort((a, b) => (b.present / b.total) - (a.present / a.total));
  };

  const getTeamAverageAttendance = () => {
    const historicData = getFilteredHistoricData();
    if (historicData.length === 0) return 0;
    
    const totalPercentage = historicData.reduce((sum, player) => sum + (player.present / player.total), 0);
    return Math.round((totalPercentage / historicData.length) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En curso';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Sin estado';
    }
  };

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Presente</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Ausente</Badge>;
      case 'justified':
        return <Badge className="bg-yellow-100 text-yellow-800">Justificado</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Sin estado</Badge>;
    }
  };

  const getTrainingStats = (players: Player[]) => {
    const present = players.filter(p => p.attendance === 'present').length;
    const absent = players.filter(p => p.attendance === 'absent').length;
    const justified = players.filter(p => p.attendance === 'justified').length;
    const pending = players.filter(p => p.attendance === 'pending').length;
    
    return { present, absent, justified, pending, total: players.length };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'future':
        return 'Entrenamientos Futuros';
      case 'past':
        return 'Entrenamientos Anteriores';
      case 'historic':
        return 'Histórico de Asistencia';
      default:
        return 'Control de Asistencia';
    }
  };

  const renderEnhancedHistoricView = () => {
    const historicData = getFilteredHistoricData();
    const teamAverage = getTeamAverageAttendance();
    const topPerformer = historicData[0];
    
    return (
      <div className="space-y-6">
        <Card className="bg-blue-50 border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Filtros:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Período:</span>
                <Select value={historicFilter} onValueChange={(value: HistoricFilter) => setHistoricFilter(value)}>
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los entrenamientos</SelectItem>
                    <SelectItem value="last-month">Último mes</SelectItem>
                    <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                    <SelectItem value="season">Temporada actual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Posición:</span>
                <Select value={positionFilter} onValueChange={(value: PositionFilter) => setPositionFilter(value)}>
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las posiciones</SelectItem>
                    <SelectItem value="Portero">Portero</SelectItem>
                    <SelectItem value="Defensa">Defensa</SelectItem>
                    <SelectItem value="Centrocampista">Centrocampista</SelectItem>
                    <SelectItem value="Delantero">Delantero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Jugadores</p>
                  <p className="text-2xl font-bold text-blue-900">{historicData.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Media del Equipo</p>
                  <p className="text-2xl font-bold text-green-900">{teamAverage}%</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Mejor Jugador</p>
                  <p className="text-lg font-bold text-yellow-900">
                    {topPerformer ? `${Math.round((topPerformer.present / topPerformer.total) * 100)}%` : '0%'}
                  </p>
                  <p className="text-xs text-yellow-700">{topPerformer?.name || 'N/A'}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Entrenamientos</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {trainings.filter(t => t.status === 'completed').length}
                  </p>
                </div>
                <History className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Top 5 - Mejor Asistencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {historicData.slice(0, 5).map((player, index) => {
                const percentage = Math.round((player.present / player.total) * 100);
                const medalColors = ['bg-yellow-100 text-yellow-800', 'bg-gray-100 text-gray-800', 'bg-orange-100 text-orange-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800'];
                
                return (
                  <div key={player.name} className={`p-4 rounded-lg border-2 border-dashed ${index === 0 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-lg ${medalColors[index] || 'bg-gray-100 text-gray-800'}`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 mx-auto mb-2">
                        {player.number}
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{player.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{player.position}</p>
                      <p className="text-xl font-bold text-gray-900">{percentage}%</p>
                      <p className="text-xs text-gray-500">
                        {player.present}/{player.total} entrenos
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estadísticas Detalladas por Jugador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historicData.map((player) => {
                const percentage = Math.round((player.present / player.total) * 100);
                return (
                  <div key={player.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                        {player.number}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{player.name}</p>
                        <p className="text-sm text-gray-500">{player.position}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{percentage}%</p>
                        <p className="text-xs text-gray-500">Asistencia</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">{player.present}</p>
                        <p className="text-xs text-gray-500">Presentes</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-red-600">{player.absent}</p>
                        <p className="text-xs text-gray-500">Ausentes</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-yellow-600">{player.justified}</p>
                        <p className="text-xs text-gray-500">Justificados</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-purple-600">{player.consecutivePresent}</p>
                        <p className="text-xs text-gray-500">Consecutivos</p>
                      </div>
                      
                      {player.lastAbsence && (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">{formatDate(player.lastAbsence)}</p>
                          <p className="text-xs text-gray-500">Última ausencia</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{getViewTitle()}</h1>
          {viewMode === 'future' && (
            <Button onClick={addNewTraining} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Añadir Entrenamiento
            </Button>
          )}
        </div>

        <div className="flex space-x-4">
          <Button 
            variant={viewMode === 'future' ? 'default' : 'outline'}
            onClick={() => setViewMode('future')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Entrenamientos Futuros
          </Button>
          <Button 
            variant={viewMode === 'past' ? 'default' : 'outline'}
            onClick={() => setViewMode('past')}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Entrenamientos Anteriores
          </Button>
          <Button 
            variant={viewMode === 'historic' ? 'default' : 'outline'}
            onClick={() => setViewMode('historic')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Histórico
          </Button>
        </div>

        {viewMode === 'historic' ? (
          renderEnhancedHistoricView()
        ) : (
          <div className="space-y-4">
            {filterTrainings().map((training) => {
              const stats = getTrainingStats(training.players);
              const isOpen = openTraining === training.id;
              
              return (
                <Card key={training.id} className="w-full">
                  <Collapsible 
                    open={isOpen} 
                    onOpenChange={(open) => setOpenTraining(open ? training.id : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            <div>
                              <CardTitle className="text-lg">
                                {formatDate(training.date)} - Entrenamiento
                              </CardTitle>
                              <p className="text-sm text-gray-500">Hora: {training.time}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(training.status)}
                              <span className="text-sm font-medium">
                                {getStatusText(training.status)}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              {stats.present + stats.justified}/{stats.total} presentes
                            </div>
                            
                            {isOpen ? (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-blue-600">Total</p>
                                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                              </div>
                              <Users className="h-8 w-8 text-blue-500" />
                            </div>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-l-green-500">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-600">Presentes</p>
                                <p className="text-2xl font-bold text-green-900">{stats.present}</p>
                              </div>
                              <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                          </div>

                          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-l-red-500">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-red-600">Ausentes</p>
                                <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
                              </div>
                              <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-l-yellow-500">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-yellow-600">Justificados</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.justified}</p>
                              </div>
                              <Clock className="h-8 w-8 text-yellow-500" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Lista de Jugadores</h3>
                          {training.players.map((player) => (
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
                                {viewMode === 'future' && (
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-green-600 border-green-300 hover:bg-green-50"
                                      onClick={() => updatePlayerAttendance(training.id, player.id, 'present')}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                      onClick={() => updatePlayerAttendance(training.id, player.id, 'absent')}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                                      onClick={() => updatePlayerAttendance(training.id, player.id, 'justified')}
                                    >
                                      <Clock className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
