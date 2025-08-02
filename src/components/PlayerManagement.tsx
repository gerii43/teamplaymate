import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Camera, 
  Save, 
  X,
  FileText,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Player {
  id: string;
  name: string;
  position?: string;
  profilePicture?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface PlayerManagementProps {
  teamId?: string;
  onPlayersChange?: (players: Player[]) => void;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({ teamId, onPlayersChange }) => {
  const { language } = useLanguage();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    notes: '',
    profilePicture: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, [teamId]);

  const loadPlayers = () => {
    const storageKey = teamId ? `statsor_players_${teamId}` : 'statsor_players';
    const savedPlayers = localStorage.getItem(storageKey);
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  };

  const savePlayers = (newPlayers: Player[]) => {
    const storageKey = teamId ? `statsor_players_${teamId}` : 'statsor_players';
    localStorage.setItem(storageKey, JSON.stringify(newPlayers));
    setPlayers(newPlayers);
    onPlayersChange?.(newPlayers);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          profilePicture: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      notes: '',
      profilePicture: ''
    });
    setEditingPlayer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(language === 'en' ? 'Player name is required' : 'El nombre del jugador es requerido');
      return;
    }

    setIsLoading(true);

    try {
      const newPlayer: Player = {
        id: editingPlayer?.id || `player_${Date.now()}`,
        name: formData.name.trim(),
        position: formData.position.trim() || undefined,
        profilePicture: formData.profilePicture || undefined,
        notes: formData.notes.trim(),
        createdAt: editingPlayer?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedPlayers: Player[];
      
      if (editingPlayer) {
        updatedPlayers = players.map(p => p.id === editingPlayer.id ? newPlayer : p);
        toast.success(language === 'en' ? 'Player updated successfully' : 'Jugador actualizado exitosamente');
      } else {
        updatedPlayers = [...players, newPlayer];
        toast.success(language === 'en' ? 'Player added successfully' : 'Jugador agregado exitosamente');
      }

      savePlayers(updatedPlayers);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(language === 'en' ? 'Error saving player' : 'Error al guardar jugador');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      position: player.position || '',
      notes: player.notes,
      profilePicture: player.profilePicture || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (playerId: string) => {
    const updatedPlayers = players.filter(p => p.id !== playerId);
    savePlayers(updatedPlayers);
    toast.success(language === 'en' ? 'Player deleted successfully' : 'Jugador eliminado exitosamente');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Player Management' : 'Gestión de Jugadores'}
          </h2>
          <Badge variant="secondary" className="ml-2">
            {players.length} {language === 'en' ? 'players' : 'jugadores'}
          </Badge>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add Player' : 'Agregar Jugador'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPlayer 
                  ? (language === 'en' ? 'Edit Player' : 'Editar Jugador')
                  : (language === 'en' ? 'Add New Player' : 'Agregar Nuevo Jugador')
                }
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.profilePicture} />
                    <AvatarFallback className="text-lg">
                      {formData.name ? getInitials(formData.name) : <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Player Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'en' ? 'Player Name *' : 'Nombre del Jugador *'}
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'Enter player name' : 'Ingresa el nombre del jugador'}
                  required
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'en' ? 'Position' : 'Posición'}
                </label>
                <Input
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g., Forward, Midfielder, Defender' : 'ej. Delantero, Mediocampista, Defensa'}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'en' ? 'Notes' : 'Notas'}
                </label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'Add notes about the player...' : 'Agrega notas sobre el jugador...'}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Cancel' : 'Cancelar'}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editingPlayer 
                    ? (language === 'en' ? 'Update' : 'Actualizar')
                    : (language === 'en' ? 'Save' : 'Guardar')
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={player.profilePicture} />
                      <AvatarFallback className="text-lg">
                        {getInitials(player.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{player.name}</h3>
                      {player.position && (
                        <Badge variant="outline" className="mt-1">
                          {player.position}
                        </Badge>
                      )}
                      
                      {player.notes && (
                        <div className="mt-2 flex items-start space-x-1">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {player.notes}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(player)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {language === 'en' ? 'Edit' : 'Editar'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(player.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {players.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === 'en' ? 'No players yet' : 'Aún no hay jugadores'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'en' 
              ? 'Start by adding your first player to the team'
              : 'Comienza agregando tu primer jugador al equipo'
            }
          </p>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Add First Player' : 'Agregar Primer Jugador'}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default PlayerManagement; 