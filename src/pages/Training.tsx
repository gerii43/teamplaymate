import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { 
  Search,
  Clock,
  Users,
  Target,
  Zap,
  Plus,
  Save,
  Share,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { trainingService, TrainingSession } from '@/services/trainingService';

interface Exercise {
  id: string;
  name: string;
  type: 'tactico' | 'tecnico' | 'fisico' | 'cognitivo';
  category: 'ataque' | 'defensa' | 'transiciones' | 'abp' | 'especiales';
  duration: number; // in minutes
  players: number;
  objective: string;
  image?: string;
}

// Mock exercises data
const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Posesión 7v7+2',
    type: 'tactico',
    category: 'ataque',
    duration: 15,
    players: 16,
    objective: 'Mantener posesión del balón y crear superioridades',
    image: '/lovable-uploads/photo_2025-06-28_12-01-21.jpg'
  },
  {
    id: '2',
    name: 'Presión tras pérdida',
    type: 'tactico',
    category: 'defensa',
    duration: 20,
    players: 22,
    objective: 'Recuperar balón rápidamente tras pérdida',
    image: '/lovable-uploads/photo_2025-06-28_12-01-27.jpg'
  },
  {
    id: '3',
    name: 'Transición defensa-ataque',
    type: 'tactico',
    category: 'transiciones',
    duration: 18,
    players: 20,
    objective: 'Cambio rápido de mentalidad defensiva a ofensiva',
    image: '/lovable-uploads/photo_2025-06-28_12-01-32.jpg'
  },
  {
    id: '4',
    name: 'Control orientado',
    type: 'tecnico',
    category: 'abp',
    duration: 12,
    players: 8,
    objective: 'Mejorar el primer toque y orientación corporal',
    image: '/lovable-uploads/photo_2025-06-28_12-01-36.jpg'
  },
  {
    id: '5',
    name: 'Finalización 1v1',
    type: 'tecnico',
    category: 'ataque',
    duration: 10,
    players: 6,
    objective: 'Mejorar la definición en situaciones de uno contra uno',
    image: '/lovable-uploads/photo_2025-06-28_12-01-44.jpg'
  },
  {
    id: '6',
    name: 'Córners defensivos',
    type: 'tactico',
    category: 'especiales',
    duration: 8,
    players: 22,
    objective: 'Organización defensiva en situaciones de córner',
    image: '/lovable-uploads/football-button.jpg'
  }
];

const Training = () => {
  const { t } = useLanguage();
  const [exercises] = useState<Exercise[]>(mockExercises);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(mockExercises);
  const [currentSession, setCurrentSession] = useState<TrainingSession>({
    id: Date.now().toString(),
    name: 'Nueva Sesión',
    exercises: [],
    totalDuration: 0,
    createdAt: new Date()
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null);
  const [sessionHistory, setSessionHistory] = useState<TrainingSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load session history on component mount
  React.useEffect(() => {
    const history = trainingService.getSessionHistory();
    setSessionHistory(history);
  }, []);

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'ataque', label: 'Ataque' },
    { value: 'defensa', label: 'Defensa' },
    { value: 'transiciones', label: 'Transiciones' },
    { value: 'abp', label: 'ABP' },
    { value: 'especiales', label: 'Situaciones Especiales' }
  ];

  const types = [
    { value: 'all', label: 'Todos' },
    { value: 'tactico', label: 'Táctico' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'fisico', label: 'Físico' },
    { value: 'cognitivo', label: 'Cognitivo' }
  ];

  // Filter exercises based on search and filters
  React.useEffect(() => {
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.objective.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(exercise => exercise.type === selectedType);
    }

    setFilteredExercises(filtered);
  }, [searchTerm, selectedCategory, selectedType, exercises]);

  const handleDragStart = (exercise: Exercise) => {
    setDraggedExercise(exercise);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedExercise) {
      addExerciseToSession(draggedExercise);
      setDraggedExercise(null);
    }
  };

  const addExerciseToSession = (exercise: Exercise) => {
    const newSession = {
      ...currentSession,
      exercises: [...currentSession.exercises, { ...exercise, id: `${exercise.id}_${Date.now()}` }],
      totalDuration: currentSession.totalDuration + exercise.duration
    };
    setCurrentSession(newSession);
    toast.success(`${exercise.name} añadido a la sesión`);
  };

  const removeExerciseFromSession = (exerciseId: string) => {
    const exerciseToRemove = currentSession.exercises.find(ex => ex.id === exerciseId);
    if (exerciseToRemove) {
      const newSession = {
        ...currentSession,
        exercises: currentSession.exercises.filter(ex => ex.id !== exerciseId),
        totalDuration: currentSession.totalDuration - exerciseToRemove.duration
      };
      setCurrentSession(newSession);
      toast.success('Ejercicio eliminado de la sesión');
    }
  };

  const saveSession = () => {
    if (currentSession.exercises.length === 0) {
      toast.error('Add at least one exercise to save the session');
      return;
    }

    try {
      const sessionToSave = {
        name: currentSession.name,
        exercises: currentSession.exercises,
        totalDuration: currentSession.totalDuration,
        createdBy: 'current_user', // In production, get from auth context
        sport: 'soccer' as const, // Get from sport context
        notes: ''
      };

      trainingService.saveSession(sessionToSave).then(savedSession => {
        toast.success('Training session saved successfully!');
        setSessionHistory(prev => [savedSession, ...prev]);
        
        // Reset current session
        setCurrentSession({
          id: Date.now().toString(),
          name: 'Nueva Sesión',
          exercises: [],
          totalDuration: 0,
          createdAt: new Date()
        });
      });
    } catch (error) {
      toast.error('Failed to save session');
      console.error('Save session error:', error);
    }
  };

  const shareSession = async (format: 'link' | 'email' | 'whatsapp') => {
    if (currentSession.exercises.length === 0) {
      toast.error('Add exercises to share the session');
      return;
    }

    try {
      // First save the session if it's not saved
      let sessionToShare = currentSession;
      if (!sessionHistory.find(s => s.id === currentSession.id)) {
        const sessionToSave = {
          name: currentSession.name,
          exercises: currentSession.exercises,
          totalDuration: currentSession.totalDuration,
          createdBy: 'current_user',
          sport: 'soccer' as const,
          notes: ''
        };
        sessionToShare = await trainingService.saveSession(sessionToSave);
      }

      const shareUrl = await trainingService.shareSession(sessionToShare.id, { format });
      
      switch (format) {
        case 'link':
          toast.success('Share link copied to clipboard!');
          break;
        case 'email':
          toast.success('Email client opened');
          break;
        case 'whatsapp':
          toast.success('WhatsApp opened');
          break;
      }
    } catch (error) {
      toast.error('Failed to share session');
      console.error('Share session error:', error);
    }
  };

  const exportToPDF = async () => {
    if (currentSession.exercises.length === 0) {
      toast.error('Add exercises to export the session');
      return;
    }

    try {
      // Convert current session to TrainingSession format
      const sessionToExport: TrainingSession = {
        id: currentSession.id,
        name: currentSession.name,
        exercises: currentSession.exercises,
        totalDuration: currentSession.totalDuration,
        createdAt: currentSession.createdAt,
        updatedAt: new Date(),
        createdBy: 'current_user',
        sport: 'soccer',
        notes: ''
      };

      await trainingService.exportToPDF(sessionToExport);
      toast.success('PDF export initiated - check your browser for the print dialog');
    } catch (error) {
      toast.error('Failed to export PDF');
      console.error('PDF export error:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tactico': return 'bg-blue-100 text-blue-800';
      case 'tecnico': return 'bg-green-100 text-green-800';
      case 'fisico': return 'bg-red-100 text-red-800';
      case 'cognitivo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ataque': return 'bg-orange-100 text-orange-800';
      case 'defensa': return 'bg-indigo-100 text-indigo-800';
      case 'transiciones': return 'bg-yellow-100 text-yellow-800';
      case 'abp': return 'bg-pink-100 text-pink-800';
      case 'especiales': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Entrenamientos</h1>
          <p className="text-muted-foreground mt-2">Crea sesiones de entrenamiento personalizadas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={saveSession}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Sesión
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              const dropdown = document.createElement('div');
              dropdown.className = 'absolute bg-white border rounded shadow-lg p-2 z-50';
              dropdown.style.top = '100%';
              dropdown.style.right = '0';
              dropdown.innerHTML = `
                <button class="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded" onclick="shareSession('link')">Share Link</button>
                <button class="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded" onclick="shareSession('email')">Share via Email</button>
                <button class="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded" onclick="shareSession('whatsapp')">Share via WhatsApp</button>
              `;
              
              // Add to DOM temporarily
              const container = document.createElement('div');
              container.className = 'relative inline-block';
              container.appendChild(dropdown);
              
              // Position and show
              const rect = (event.target as HTMLElement).getBoundingClientRect();
              container.style.position = 'fixed';
              container.style.top = rect.bottom + 'px';
              container.style.right = (window.innerWidth - rect.right) + 'px';
              document.body.appendChild(container);
              
              // Add global click handler to close
              const closeDropdown = () => {
                document.body.removeChild(container);
                document.removeEventListener('click', closeDropdown);
              };
              setTimeout(() => document.addEventListener('click', closeDropdown), 100);
              
              // Make functions available globally
              (window as any).shareSession = shareSession;
            }}
          >
            <Share className="w-4 h-4 mr-2" />
            Compartir
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(!showHistory)}
          >
            <Clock className="w-4 h-4 mr-2" />
            Historial ({sessionHistory.length})
          </Button>
        </div>
      </div>

      {/* Session History */}
      {showHistory && (
        <div className="bg-card rounded-lg border shadow-sm mb-6">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Session History</h2>
          </div>
          <div className="p-4">
            {sessionHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No saved sessions yet</p>
            ) : (
              <div className="space-y-3">
                {sessionHistory.slice(0, 10).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{session.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.exercises.length} exercises • {session.totalDuration} min • {session.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentSession({
                            id: session.id,
                            name: session.name + ' (Copy)',
                            exercises: session.exercises,
                            totalDuration: session.totalDuration,
                            createdAt: new Date()
                          });
                          setShowHistory(false);
                          toast.success('Session loaded');
                        }}
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => trainingService.exportToPDF(session)}
                      >
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exercise Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold mb-4">Galería de Ejercicios</h2>
              
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar ejercicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {types.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    draggable
                    onDragStart={() => handleDragStart(exercise)}
                    className="bg-background border rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
                  >
                    {exercise.image && (
                      <img
                        src={exercise.image}
                        alt={exercise.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-foreground mb-2">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{exercise.objective}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getTypeColor(exercise.type)}>
                        {exercise.type}
                      </Badge>
                      <Badge className={getCategoryColor(exercise.category)}>
                        {exercise.category}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {exercise.duration} min
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {exercise.players} jug.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Session Builder */}
        <div className="space-y-6">
          {/* Session Timeline */}
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Sesión de Entrenamiento</h2>
              <Input
                value={currentSession.name}
                onChange={(e) => setCurrentSession({...currentSession, name: e.target.value})}
                className="mt-2"
                placeholder="Nombre de la sesión"
              />
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Duración Total</span>
                  <span className="text-lg font-bold text-primary">
                    {currentSession.totalDuration} min
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((currentSession.totalDuration / 90) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Meta: 90 minutos
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 mb-4 min-h-[100px] bg-muted/10"
              >
                {currentSession.exercises.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <Target className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Arrastra ejercicios aquí para crear tu sesión</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentSession.exercises.map((exercise, index) => (
                      <div
                        key={exercise.id}
                        className="bg-background border rounded-lg p-3 flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{exercise.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getTypeColor(exercise.type)}>
                              {exercise.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {exercise.duration} min
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExerciseFromSession(exercise.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Smart Suggestions */}
              <div className="border rounded-lg p-4 bg-primary/5">
                <div className="flex items-center mb-2">
                  <Zap className="w-4 h-4 mr-2 text-primary" />
                  <h3 className="font-semibold text-sm">Sugerencias Inteligentes</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Basado en el último partido, recomendamos ejercicios defensivos
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => addExerciseToSession(exercises[1])}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Presión tras pérdida
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => addExerciseToSession(exercises[5])}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Córners defensivos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Training;