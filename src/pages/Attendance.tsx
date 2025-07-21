import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, XCircle, Clock, Users, Calendar, Plus, ChevronDown, ChevronRight } from 'lucide-react';

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

const Attendance = () => {
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
      date: '2024-01-17',
      time: '19:00',
      status: 'in-progress',
      players: [
        { id: 1, name: 'Juan García', position: 'Delantero', attendance: 'present', number: 10 },
        { id: 2, name: 'Carlos López', position: 'Centrocampista', attendance: 'present', number: 8 },
        { id: 3, name: 'Miguel Rodríguez', position: 'Defensa', attendance: 'present', number: 4 },
        { id: 4, name: 'Antonio Martín', position: 'Portero', attendance: 'present', number: 1 },
        { id: 5, name: 'David Fernández', position: 'Delantero', attendance: 'present', number: 9 },
        { id: 6, name: 'Luis Sánchez', position: 'Centrocampista', attendance: 'present', number: 6 },
        { id: 7, name: 'Pedro Jiménez', position: 'Defensa', attendance: 'pending', number: 3 },
        { id: 8, name: 'Francisco Ruiz', position: 'Defensa', attendance: 'pending', number: 2 },
      ]
    },
    {
      id: 3,
      date: '2024-01-19',
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
        
        // Update training status based on attendance
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

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Control de Asistencia</h1>
          <Button onClick={addNewTraining} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Añadir Entrenamiento
          </Button>
        </div>

        <div className="space-y-4">
          {trainings.map((training) => {
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
                      {/* Stats Cards */}
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

                      {/* Players List */}
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
      </div>
    </Layout>
  );
};

export default Attendance;
