import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ScatterChart, Scatter
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, Users, Target, 
  Clock, Filter, Download, RefreshCw, Maximize2, 
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Settings, Calendar, Search, ChevronDown, ChevronUp,
  Play, Pause, SkipForward, AlertCircle, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { analyticsExportService } from '@/services/analyticsExportService';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data generators
const generatePlayerData = () => {
  const players = ['Messi', 'Ronaldo', 'Neymar', 'Mbappé', 'Haaland', 'Benzema', 'Lewandowski', 'Salah'];
  return players.map((name, index) => ({
    name,
    goals: Math.floor(Math.random() * 30) + 5,
    assists: Math.floor(Math.random() * 20) + 2,
    minutes: Math.floor(Math.random() * 2000) + 1000,
    passes: Math.floor(Math.random() * 500) + 200,
    accuracy: Math.floor(Math.random() * 30) + 70,
    rating: (Math.random() * 3 + 7).toFixed(1),
    form: Math.floor(Math.random() * 100),
    id: index
  }));
};

const generateMatchData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    wins: Math.floor(Math.random() * 8) + 2,
    draws: Math.floor(Math.random() * 4) + 1,
    losses: Math.floor(Math.random() * 3) + 1,
    goalsFor: Math.floor(Math.random() * 25) + 15,
    goalsAgainst: Math.floor(Math.random() * 15) + 5,
    possession: Math.floor(Math.random() * 20) + 50,
    shots: Math.floor(Math.random() * 50) + 100,
    corners: Math.floor(Math.random() * 30) + 20
  }));
};

const generateRealTimeData = () => ({
  currentMatch: {
    homeTeam: 'Statsor FC',
    awayTeam: 'Rivals United',
    score: { home: 2, away: 1 },
    minute: 67,
    possession: { home: 58, away: 42 },
    shots: { home: 12, away: 8 },
    corners: { home: 6, away: 3 },
    fouls: { home: 8, away: 11 },
    cards: { home: { yellow: 2, red: 0 }, away: { yellow: 3, red: 1 } }
  },
  liveEvents: [
    { minute: 67, type: 'goal', player: 'Messi', team: 'home' },
    { minute: 65, type: 'yellow_card', player: 'Ronaldo', team: 'away' },
    { minute: 62, type: 'substitution', player: 'Neymar', team: 'home' },
    { minute: 58, type: 'goal', player: 'Mbappé', team: 'away' },
    { minute: 45, type: 'goal', player: 'Haaland', team: 'home' }
  ]
});

const COLORS = ['#4ADE80', '#60A5FA', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899'];

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const { t } = useLanguage();
  const [playerData, setPlayerData] = useState(generatePlayerData());
  const [matchData, setMatchData] = useState(generateMatchData());
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData());
  const [selectedMetric, setSelectedMetric] = useState('goals');
  const [timeRange, setTimeRange] = useState('season');
  const [isLive, setIsLive] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [sortBy, setSortBy] = useState('goals');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'radar'>('bar');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedCards, setExpandedCards] = useState<string[]>(['overview']);

  // Real-time data updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setIsProcessing(true);
      
      setTimeout(() => {
        setPlayerData(generatePlayerData());
        setMatchData(generateMatchData());
        setRealTimeData(generateRealTimeData());
        setIsProcessing(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filtered and sorted data
  const filteredPlayers = useMemo(() => {
    let filtered = playerData.filter(player => 
      player.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (selectedPlayers.length > 0) {
      filtered = filtered.filter(player => selectedPlayers.includes(player.id));
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [playerData, filterValue, selectedPlayers, sortBy, sortOrder]);

  // Chart data transformations
  const chartData = useMemo(() => {
    switch (chartType) {
      case 'pie':
        return filteredPlayers.slice(0, 6).map(player => ({
          name: player.name,
          value: player[selectedMetric as keyof typeof player] as number,
          fill: COLORS[filteredPlayers.indexOf(player) % COLORS.length]
        }));
      case 'radar':
        return filteredPlayers.slice(0, 1).map(player => ([
          { metric: 'Goals', value: player.goals, fullMark: 30 },
          { metric: 'Assists', value: player.assists, fullMark: 20 },
          { metric: 'Accuracy', value: player.accuracy, fullMark: 100 },
          { metric: 'Form', value: player.form, fullMark: 100 },
          { metric: 'Rating', value: parseFloat(player.rating) * 10, fullMark: 100 }
        ]))[0];
      default:
        return filteredPlayers.map(player => ({
          name: player.name,
          [selectedMetric]: player[selectedMetric as keyof typeof player],
          fill: COLORS[filteredPlayers.indexOf(player) % COLORS.length]
        }));
    }
  }, [filteredPlayers, selectedMetric, chartType]);

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handlePlayerSelection = (playerId: number) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const exportData = () => {
    try {
      analyticsExportService.exportPlayerStats(filteredPlayers, {
        format: 'excel',
        filename: `statsor-analytics-${new Date().toISOString().split('T')[0]}`,
        includeMetadata: true
      });
      toast.success('Analytics exported successfully!');
    } catch (error) {
      toast.error('Export failed. Please try again.');
      console.error('Export error:', error);
    }
  };

  const exportMatchData = () => {
    try {
      const matchExportData = matchData.map(match => ({
        month: match.month,
        wins: match.wins,
        draws: match.draws,
        losses: match.losses,
        goalsFor: match.goalsFor,
        goalsAgainst: match.goalsAgainst,
        possession: match.possession
      }));
      
      analyticsExportService.exportAnalytics({
        title: 'Match Performance Data',
        data: matchExportData,
        metadata: {
          generatedAt: new Date().toISOString(),
          generatedBy: 'Statsor Analytics Dashboard',
          sport: 'football'
        }
      }, {
        format: 'pdf',
        includeMetadata: true
      });
      
      toast.success('Match data exported to PDF!');
    } catch (error) {
      toast.error('Export failed. Please try again.');
      console.error('Export error:', error);
    }
  };
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
        >
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 p-6 bg-gray-50 min-h-screen ${className}`}>
      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Activity className="w-8 h-8 mr-3 text-primary" />
              Analytics Dashboard
              {isLive && (
                <Badge className="ml-3 bg-red-500 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                  LIVE
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-1">Real-time performance analytics and insights</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                id="auto-refresh"
              />
              <label htmlFor="auto-refresh" className="text-sm font-medium">
                Auto Refresh
              </label>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="season">Season</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="match">Match</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Players
            </Button>
            
            <Button onClick={exportMatchData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Matches
            </Button>

            <Button 
              onClick={() => {
                setIsProcessing(true);
                setTimeout(() => {
                  setPlayerData(generatePlayerData());
                  setMatchData(generateMatchData());
                  setRealTimeData(generateRealTimeData());
                  setIsProcessing(false);
                }, 1000);
              }}
              variant="outline" 
              size="sm"
              disabled={isProcessing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search players..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="goals">Goals</SelectItem>
              <SelectItem value="assists">Assists</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="passes">Passes</SelectItem>
              <SelectItem value="accuracy">Accuracy</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="goals">Goals</SelectItem>
              <SelectItem value="assists">Assists</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="accuracy">Accuracy</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <LineChartIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
            >
              <PieChartIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Live Match Status */}
      <AnimatePresence>
        {isLive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-6"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold">{realTimeData.currentMatch.homeTeam}</div>
                  <div className="text-3xl font-bold">{realTimeData.currentMatch.score.home}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm opacity-75">LIVE</div>
                  <div className="text-xl font-bold">{realTimeData.currentMatch.minute}'</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{realTimeData.currentMatch.awayTeam}</div>
                  <div className="text-3xl font-bold">{realTimeData.currentMatch.score.away}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">Possession</div>
                  <div>{realTimeData.currentMatch.possession.home}% - {realTimeData.currentMatch.possession.away}%</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Shots</div>
                  <div>{realTimeData.currentMatch.shots.home} - {realTimeData.currentMatch.shots.away}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Corners</div>
                  <div>{realTimeData.currentMatch.corners.home} - {realTimeData.currentMatch.corners.away}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Player Performance - {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {isProcessing && (
                  <div className="flex items-center text-sm text-gray-500">
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Processing...
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCardExpansion('chart')}
                >
                  {expandedCards.includes('chart') ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={chartType}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <>
                      {chartType === 'bar' && (
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey={selectedMetric} fill="#4ADE80" />
                        </BarChart>
                      )}
                      {chartType === 'line' && (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey={selectedMetric} 
                            stroke="#4ADE80" 
                            strokeWidth={3}
                            dot={{ fill: '#4ADE80', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      )}
                      {chartType === 'pie' && (
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      )}
                    </>
                  </ResponsiveContainer>
                  {chartType === 'radar' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#4ADE80"
                          fill="#4ADE80"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip content={<CustomTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredPlayers.slice(0, 5).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPlayers.includes(player.id) 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handlePlayerSelection(player.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-gray-500">
                        Rating: {player.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {player[selectedMetric as keyof typeof player]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedMetric}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Live Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Live Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {realTimeData.liveEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {event.minute}'
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{event.player}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {event.type.replace('_', ' ')}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    event.team === 'home' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="team">Team Stats</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Goals', value: '127', change: '+12%', icon: Target, color: 'text-green-600' },
                { title: 'Win Rate', value: '73%', change: '+5%', icon: TrendingUp, color: 'text-blue-600' },
                { title: 'Avg Possession', value: '64%', change: '+2%', icon: Activity, color: 'text-purple-600' },
                { title: 'Clean Sheets', value: '18', change: '+3', icon: CheckCircle, color: 'text-orange-600' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Season Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={matchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="wins" 
                        stackId="1" 
                        stroke="#4ADE80" 
                        fill="#4ADE80" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="draws" 
                        stackId="1" 
                        stroke="#F59E0B" 
                        fill="#F59E0B" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="losses" 
                        stackId="1" 
                        stroke="#EF4444" 
                        fill="#EF4444" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="individual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Player Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={filteredPlayers}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="goals" name="Goals" />
                        <YAxis dataKey="assists" name="Assists" />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                  <p className="font-semibold">{data.name}</p>
                                  <p>Goals: {data.goals}</p>
                                  <p>Assists: {data.assists}</p>
                                  <p>Rating: {data.rating}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter dataKey="assists" fill="#4ADE80" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['goals', 'assists', 'accuracy', 'rating'].map((metric) => {
                      const values = filteredPlayers.map(p => p[metric as keyof typeof p] as number);
                      const avg = values.reduce((a, b) => a + b, 0) / values.length;
                      const max = Math.max(...values);
                      
                      return (
                        <div key={metric} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize font-medium">{metric}</span>
                            <span className="text-sm text-gray-500">
                              Avg: {avg.toFixed(1)} | Max: {max}
                            </span>
                          </div>
                          <Progress value={(avg / max) * 100} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={matchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="goalsFor" 
                        stroke="#4ADE80" 
                        strokeWidth={3}
                        name="Goals For"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="goalsAgainst" 
                        stroke="#EF4444" 
                        strokeWidth={3}
                        name="Goals Against"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="possession" 
                        stroke="#60A5FA" 
                        strokeWidth={3}
                        name="Possession %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedPlayers.length >= 2 ? (
                selectedPlayers.slice(0, 2).map((playerId, index) => {
                  const player = playerData.find(p => p.id === playerId);
                  if (!player) return null;

                  return (
                    <motion.div
                      key={playerId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>{player.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(player).filter(([key]) => 
                              ['goals', 'assists', 'accuracy', 'rating'].includes(key)
                            ).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center">
                                <span className="capitalize">{key}</span>
                                <span className="font-bold">{value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <div className="lg:col-span-2 text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select at least 2 players to compare</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};