import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Activity,
  AlertTriangle,
  Trophy,
  Zap,
  Timer,
  Square,
  Maximize,
  Minimize,
  Edit,
  Save,
  RotateCcw as ResetIcon,
  GripVertical
} from 'lucide-react';

// Sortable Action Button Component
const SortableActionButton = ({ action, onAction, selectedPlayer, disabled }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: action.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Button
        onClick={() => onAction(action.id, action.name)}
        disabled={disabled}
        className={`h-12 text-xs font-semibold ${action.color} w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''} relative`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3 absolute left-1 opacity-30" />
        <span className="ml-3">{action.name}</span>
      </Button>
    </div>
  );
};

// Sortable Player Button Component
const SortablePlayerButton = ({ player, onSelect, selectedPlayer }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Button
        onClick={() => onSelect(player.id)}
        className={`h-12 text-xs font-semibold transition-all relative w-full ${
          selectedPlayer === player.id 
            ? 'bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-300' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3 absolute left-1 opacity-30" />
        <div className="w-5 h-5 bg-white text-gray-700 rounded-full flex items-center justify-center ml-4 mr-1 font-bold text-xs">
          {player.number}
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-xs">{player.name}</div>
        </div>
      </Button>
    </div>
  );
};

const CommandTable = () => {
  const { t } = useLanguage();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [liveActions, setLiveActions] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedHalf, setSelectedHalf] = useState<'first' | 'second'>('first');
  const [showGoalZoneModal, setShowGoalZoneModal] = useState(false);
  const [homeTeamFouls, setHomeTeamFouls] = useState(0);
  const [awayTeamFouls, setAwayTeamFouls] = useState(0);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [customActions, setCustomActions] = useState<any[]>([]);
  const [customPlayers, setCustomPlayers] = useState<any[]>([]);
  const [actionVisibility, setActionVisibility] = useState<Record<string, boolean>>({});
  const [playerVisibility, setPlayerVisibility] = useState<Record<string, boolean>>({});
  const [playersOnField, setPlayersOnField] = useState<string[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock players data - 14 players with goalkeeper first
  const players = [
    { id: '1', name: 'Juan', number: 1, position: 'POR', status: 'active' },
    { id: '2', name: 'Pablo', number: 9, position: 'DEL', status: 'active' },
    { id: '3', name: 'Izan', number: 4, position: 'DEF', status: 'active' },
    { id: '4', name: 'Jordi', number: 8, position: 'CC', status: 'active' },
    { id: '5', name: 'Nil', number: 15, position: 'DEF', status: 'active' },
    { id: '6', name: 'Mateo', number: 2, position: 'DEF', status: 'active' },
    { id: '7', name: 'Adrián', number: 15, position: 'DEF', status: 'active' },
    { id: '8', name: 'Julio', number: 43, position: 'CC', status: 'active' },
    { id: '9', name: 'Roberto', number: 67, position: 'CC', status: 'active' },
    { id: '10', name: 'Luis', number: 91, position: 'DEF', status: 'active' },
    { id: '11', name: 'Pol', number: 23, position: 'DEL', status: 'active' },
    { id: '12', name: 'Roger', number: 90, position: 'CC', status: 'active' },
    { id: '13', name: 'Pedro', number: 16, position: 'DEF', status: 'active' },
    { id: '14', name: 'Francisco', number: 17, position: 'DEL', status: 'active' },
  ];

  // Default actions with translations
  const getDefaultActions = () => [
    { id: 'foul_against', name: t('action.foul.against'), color: 'bg-red-500 hover:bg-red-600 text-white' },
    { id: 'foul_favor', name: t('action.foul.favor'), color: 'bg-green-500 hover:bg-green-600 text-white' },
    { id: 'penalty_favor', name: t('action.penalty.favor'), color: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { id: 'penalty_against', name: t('action.penalty.against'), color: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { id: 'ball_lost', name: t('action.ball.lost'), color: 'bg-lime-400 hover:bg-lime-500 text-gray-800' },
    { id: 'ball_recovered', name: t('action.ball.recovered'), color: 'bg-gray-500 hover:bg-gray-600 text-white' },
    { id: 'duel_won', name: t('action.duel.won'), color: 'bg-pink-500 hover:bg-pink-600 text-white' },
    { id: 'duel_lost', name: t('action.duel.lost'), color: 'bg-black hover:bg-gray-800 text-white' },
    { id: 'goal_favor', name: t('action.goal.favor'), color: 'bg-red-400 hover:bg-red-500 text-white' },
    { id: 'goal_against', name: t('action.goal.against'), color: 'bg-red-700 hover:bg-red-800 text-white' },
    { id: 'assist', name: t('action.assist'), color: 'bg-yellow-400 hover:bg-yellow-500 text-gray-800' },
    { id: 'save', name: t('action.save'), color: 'bg-cyan-400 hover:bg-cyan-500 text-gray-800' },
    { id: 'shot_goal', name: t('action.shot.goal'), color: 'bg-purple-500 hover:bg-purple-600 text-white' },
    { id: 'shot_out', name: t('action.shot.out'), color: 'bg-green-300 hover:bg-green-400 text-gray-800' },
    { id: 'corner_favor', name: t('action.corner.favor'), color: 'bg-blue-400 hover:bg-blue-500 text-white' },
    { id: 'corner_against', name: t('action.corner.against'), color: 'bg-red-600 hover:bg-red-700 text-white' },
  ];

  // Load saved configuration or use defaults
  useEffect(() => {
    const savedActions = localStorage.getItem('commandTableActions');
    const savedPlayers = localStorage.getItem('commandTablePlayers');
    const savedActionVisibility = localStorage.getItem('commandTableActionVisibility');
    const savedPlayerVisibility = localStorage.getItem('commandTablePlayerVisibility');

    if (savedActions) {
      setCustomActions(JSON.parse(savedActions));
    } else {
      setCustomActions(getDefaultActions());
    }

    if (savedPlayers) {
      setCustomPlayers(JSON.parse(savedPlayers));
    } else {
      setCustomPlayers(players);
    }

    if (savedActionVisibility) {
      setActionVisibility(JSON.parse(savedActionVisibility));
    } else {
      const defaultVisibility: Record<string, boolean> = {};
      getDefaultActions().forEach(action => {
        defaultVisibility[action.id] = true;
      });
      setActionVisibility(defaultVisibility);
    }

    if (savedPlayerVisibility) {
      setPlayerVisibility(JSON.parse(savedPlayerVisibility));
    } else {
      const defaultVisibility: Record<string, boolean> = {};
      players.forEach(player => {
        defaultVisibility[player.id] = true;
      });
      setPlayerVisibility(defaultVisibility);
    }

    // Load players on field (default: goalkeeper + first 10 field players)
    const savedPlayersOnField = localStorage.getItem('commandTablePlayersOnField');
    if (savedPlayersOnField) {
      setPlayersOnField(JSON.parse(savedPlayersOnField));
    } else {
      const defaultOnField = players.slice(0, 11).map(p => p.id); // Goalkeeper + 10 field players
      setPlayersOnField(defaultOnField);
      localStorage.setItem('commandTablePlayersOnField', JSON.stringify(defaultOnField));
    }
  }, []);

  // Save configuration when changed
  const saveConfiguration = () => {
    localStorage.setItem('commandTableActions', JSON.stringify(customActions));
    localStorage.setItem('commandTablePlayers', JSON.stringify(customPlayers));
    localStorage.setItem('commandTableActionVisibility', JSON.stringify(actionVisibility));
    localStorage.setItem('commandTablePlayerVisibility', JSON.stringify(playerVisibility));
    localStorage.setItem('commandTablePlayersOnField', JSON.stringify(playersOnField));
  };

  // Toggle player on/off field
  const togglePlayerOnField = (playerId: string) => {
    setPlayersOnField(prev => {
      const newList = prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId];
      localStorage.setItem('commandTablePlayersOnField', JSON.stringify(newList));
      return newList;
    });
  };

  // Reset to default configuration
  const resetToDefault = () => {
    const defaultActions = getDefaultActions();
    const defaultActionVisibility: Record<string, boolean> = {};
    const defaultPlayerVisibility: Record<string, boolean> = {};
    const defaultOnField = players.slice(0, 11).map(p => p.id);
    
    defaultActions.forEach(action => {
      defaultActionVisibility[action.id] = true;
    });
    
    players.forEach(player => {
      defaultPlayerVisibility[player.id] = true;
    });

    setCustomActions(defaultActions);
    setCustomPlayers(players);
    setActionVisibility(defaultActionVisibility);
    setPlayerVisibility(defaultPlayerVisibility);
    setPlayersOnField(defaultOnField);

    localStorage.setItem('commandTableActions', JSON.stringify(defaultActions));
    localStorage.setItem('commandTablePlayers', JSON.stringify(players));
    localStorage.setItem('commandTableActionVisibility', JSON.stringify(defaultActionVisibility));
    localStorage.setItem('commandTablePlayerVisibility', JSON.stringify(defaultPlayerVisibility));
    localStorage.setItem('commandTablePlayersOnField', JSON.stringify(defaultOnField));
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle action visibility toggle
  const toggleActionVisibility = (actionId: string) => {
    setActionVisibility(prev => ({
      ...prev,
      [actionId]: !prev[actionId]
    }));
  };

  // Handle player visibility toggle
  const togglePlayerVisibility = (playerId: string) => {
    setPlayerVisibility(prev => ({
      ...prev,
      [playerId]: !prev[playerId]
    }));
  };

  // Handle drag end for actions
  const handleActionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCustomActions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Handle drag end for players
  const handlePlayerDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCustomPlayers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const registerQuickAction = (actionId: string, actionName: string) => {
    if (!selectedPlayer) {
      alert(t('command.select.player'));
      return;
    }

    // Special handling for fouls - update foul counters
    if (actionId === 'foul_favor') {
      setAwayTeamFouls(prev => Math.min(prev + 1, 5));
    } else if (actionId === 'foul_against') {
      setHomeTeamFouls(prev => Math.min(prev + 1, 5));
    }

    // Special handling for goal in favor
    if (actionId === 'goal_favor') {
      setShowGoalZoneModal(true);
      return;
    }

    const player = customPlayers.find(p => p.id === selectedPlayer);
    const halfText = selectedHalf === 'first' ? t('command.first.half') : t('command.second.half');
    const newAction = {
      id: Date.now(),
      playerId: selectedPlayer,
      playerName: player?.name,
      playerNumber: player?.number,
      action: actionName,
      time: formatTime(time),
      half: selectedHalf,
      timestamp: Date.now(),
    };

    setLiveActions(prev => [newAction, ...prev]);
  };

  const handleGoalZoneSelect = (zone: number) => {
    const player = customPlayers.find(p => p.id === selectedPlayer);
    const halfText = selectedHalf === 'first' ? t('command.first.half') : t('command.second.half');
    const newAction = {
      id: Date.now(),
      playerId: selectedPlayer,
      playerName: player?.name,
      playerNumber: player?.number,
      action: t('action.goal.favor'),
      time: formatTime(time),
      half: selectedHalf,
      goalZone: zone,
      timestamp: Date.now(),
    };

    setLiveActions(prev => [newAction, ...prev]);
    setShowGoalZoneModal(false);
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setLiveActions([]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Get visible actions and players
  const visibleActions = customActions.filter(action => actionVisibility[action.id]);
  const visiblePlayers = customPlayers.filter(player => playerVisibility[player.id]);

  return (
    <Layout>
      <div className="p-2 w-full min-h-screen">
        {/* Header ocupando toda la pantalla - Cronómetro y Marcador */}
        <div className="w-full mb-4">
          <div className="w-full bg-white p-2 rounded-lg shadow-lg border">
            {/* Cronómetro central con equipos pegados */}
            <div className="flex items-center justify-center mb-3">
              {/* CD Statsor - Equipo local (izquierda) */}
              <div className="flex flex-col items-center mr-8">
                <div className="w-16 h-16 bg-blue-500 rounded-lg mb-2 shadow-md"></div>
                <span className="text-sm font-semibold text-gray-800">{t('command.home.team')}</span>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHomeTeamFouls(i < homeTeamFouls ? homeTeamFouls - 1 : homeTeamFouls + 1)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < homeTeamFouls ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Cronómetro central */}
              <div className="flex flex-col items-center">
                <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
                  {formatTime(time)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={startTimer}
                    disabled={isRunning}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {t('command.start')}
                  </Button>
                  <Button
                    onClick={pauseTimer}
                    disabled={!isRunning}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    {t('command.pause')}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    {t('command.restart')}
                  </Button>
                </div>
                
                {/* Selector de parte - cuadrados 1 y 2 */}
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => setSelectedHalf('first')}
                    className={`w-8 h-8 text-sm font-bold ${
                      selectedHalf === 'first' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-400 hover:bg-blue-500 text-white'
                    }`}
                  >
                    1
                  </Button>
                  <Button
                    onClick={() => setSelectedHalf('second')}
                    className={`w-8 h-8 text-sm font-bold ${
                      selectedHalf === 'second' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-400 hover:bg-blue-500 text-white'
                    }`}
                  >
                    2
                  </Button>
                </div>
              </div>

              {/* Equipo visitante (derecha) */}
              <div className="flex flex-col items-center ml-8">
                <div className="w-16 h-16 bg-yellow-500 rounded-lg mb-2 shadow-md"></div>
                <span className="text-sm font-semibold text-gray-800">{t('command.away.team')}</span>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setAwayTeamFouls(i < awayTeamFouls ? awayTeamFouls - 1 : awayTeamFouls + 1)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < awayTeamFouls ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parte superior - Acciones (izq) y Jugadores (der) exactamente como en la imagen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Columna izquierda - Acciones */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800">{t('command.actions')}</h2>
              <div className="flex gap-2">
                {isEditMode && (
                  <>
                    <Button
                      onClick={resetToDefault}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <ResetIcon className="h-3 w-3 mr-1" />
                      {t('command.reset.default')}
                    </Button>
                    <Button
                      onClick={() => {
                        saveConfiguration();
                        setIsEditMode(false);
                      }}
                      size="sm"
                      className="text-xs bg-green-500 hover:bg-green-600"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {t('command.save')}
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setIsEditMode(!isEditMode)}
                  size="sm"
                  className="text-xs"
                  variant={isEditMode ? "destructive" : "outline"}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {isEditMode ? t('command.cancel.edit') : t('command.edit')}
                </Button>
              </div>
            </div>
            
            {isEditMode ? (
              <div className="shadow-lg rounded-lg bg-white p-4">
                <h3 className="text-sm font-semibold mb-3">{t('command.configure.actions')}</h3>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleActionDragEnd}>
                  <SortableContext items={customActions.map(a => a.id)} strategy={rectSortingStrategy}>
                    <div className="space-y-2">
                      {customActions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={actionVisibility[action.id] || false}
                              onCheckedChange={() => toggleActionVisibility(action.id)}
                            />
                            <SortableActionButton
                              action={action}
                              onAction={() => {}}
                              selectedPlayer={true}
                              disabled={true}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleActionDragEnd}>
                <SortableContext items={visibleActions.map(a => a.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-4 gap-2 shadow-lg rounded-lg bg-white p-4">
                    {visibleActions.map((action) => (
                      <SortableActionButton
                        key={action.id}
                        action={action}
                        onAction={registerQuickAction}
                        selectedPlayer={selectedPlayer}
                        disabled={!selectedPlayer}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Columna derecha - Jugadores con portero arriba centrado */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">{t('command.players')}</h2>
            
            {isEditMode ? (
              <div className="shadow-lg rounded-lg bg-white p-4">
                <h3 className="text-sm font-semibold mb-3">{t('command.configure.players')}</h3>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePlayerDragEnd}>
                  <SortableContext items={customPlayers.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {customPlayers.map((player) => (
                        <div key={player.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={playerVisibility[player.id] || false}
                              onCheckedChange={() => togglePlayerVisibility(player.id)}
                            />
                            <SortablePlayerButton
                              player={player}
                              onSelect={() => {}}
                              selectedPlayer={null}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ) : (
              <div className="shadow-lg rounded-lg bg-white p-4">
                {/* Portero centrado arriba */}
                {visiblePlayers.filter(p => p.position === 'POR').map((goalkeeper) => (
                  <div key={goalkeeper.id} className="flex justify-center mb-4">
                    <div className="relative">
                      <Button
                        onClick={() => setSelectedPlayer(goalkeeper.id)}
                        className={`h-12 text-xs font-semibold transition-all bg-green-500 hover:bg-green-600 text-white w-32 ${
                          selectedPlayer === goalkeeper.id 
                            ? 'ring-2 ring-green-300' 
                            : ''
                        }`}
                      >
                        <div className="w-5 h-5 bg-white text-gray-700 rounded-full flex items-center justify-center mr-2 font-bold text-xs">
                          {goalkeeper.number}
                        </div>
                        <div className="font-semibold text-xs">{goalkeeper.name}</div>
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Sección de Jugadores en el Campo */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">{t('command.players.on.field')}</h3>
                  <div className="border-2 border-green-200 bg-green-50 rounded-lg p-3">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePlayerDragEnd}>
                      <SortableContext items={visiblePlayers.filter(p => p.position !== 'POR' && playersOnField.includes(p.id)).map(p => p.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-2 gap-2">
                          {visiblePlayers
                            .filter(p => p.position !== 'POR' && playersOnField.includes(p.id))
                            .map((player) => (
                            <div key={player.id} className="relative">
                              <Button
                                onClick={() => {
                                  setSelectedPlayer(player.id);
                                }}
                                onDoubleClick={() => togglePlayerOnField(player.id)}
                                className={`h-12 text-xs font-semibold transition-all w-full ${
                                  selectedPlayer === player.id 
                                    ? 'bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-300' 
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                              >
                                <div className="w-5 h-5 bg-white text-gray-700 rounded-full flex items-center justify-center mr-2 font-bold text-xs">
                                  {player.number}
                                </div>
                                <div className="font-semibold text-xs">{player.name}</div>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>

                {/* Resto de jugadores (fuera del campo) */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">{t('command.players.bench')}</h3>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePlayerDragEnd}>
                    <SortableContext items={visiblePlayers.filter(p => p.position !== 'POR' && !playersOnField.includes(p.id)).map(p => p.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-2 gap-2">
                        {visiblePlayers
                          .filter(p => p.position !== 'POR' && !playersOnField.includes(p.id))
                          .map((player) => (
                          <div key={player.id} className="relative">
                            <Button
                              onClick={() => {
                                setSelectedPlayer(player.id);
                              }}
                              onDoubleClick={() => togglePlayerOnField(player.id)}
                              className={`h-12 text-xs font-semibold transition-all w-full opacity-70 ${
                                selectedPlayer === player.id 
                                  ? 'bg-gray-600 hover:bg-gray-700 text-white ring-2 ring-gray-300' 
                                  : 'bg-gray-500 hover:bg-gray-600 text-white'
                              }`}
                            >
                              <div className="w-5 h-5 bg-white text-gray-700 rounded-full flex items-center justify-center mr-2 font-bold text-xs">
                                {player.number}
                              </div>
                              <div className="font-semibold text-xs">{player.name}</div>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Parte inferior - Acciones registradas */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">{t('command.registered.actions')}</h2>
          <div className="shadow-lg rounded-lg bg-white p-4 max-h-64 overflow-y-auto">
            {liveActions.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">{t('command.no.actions')}</div>
            ) : (
              <div className="space-y-2">
                {liveActions.map((action, index) => (
                  <div key={action.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        {action.action} – {action.playerName} – {action.half === 'first' ? t('command.first.half') : t('command.second.half')}
                      </div>
                      <div className="text-xs text-gray-500">{action.time}</div>
                    </div>
                    <Button
                      onClick={() => {
                        const updatedActions = liveActions.filter(a => a.id !== action.id);
                        setLiveActions(updatedActions);
                      }}
                      variant="outline"
                      size="sm"
                      className="ml-2 h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Goal Zone Modal */}
        <Dialog open={showGoalZoneModal} onOpenChange={setShowGoalZoneModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">{t('goal.zone.title')}</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((zone) => (
                  <Button
                    key={zone}
                    onClick={() => handleGoalZoneSelect(zone)}
                    variant="outline"
                    className="h-16 w-16 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-500 text-sm font-semibold"
                  >
                    {zone}
                  </Button>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setShowGoalZoneModal(false)}
                  variant="outline"
                  size="sm"
                >
                  {t('goal.zone.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CommandTable;
