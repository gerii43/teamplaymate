const { supabase } = require('../config/supabase.js');

class AnalyticsService {
  constructor() {
    this.table = 'analytics';
  }

  async getDashboardStats(userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month' } = options;

      // Get user's teams
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, name')
        .eq('user_id', userId);

      if (teamsError) throw teamsError;

      const teamIds = teams.map(team => team.id);

      // Get matches
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .in('team_id', teamIds);

      if (matchesError) throw matchesError;

      // Get players
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .in('team_id', teamIds);

      if (playersError) throw playersError;

      // Calculate statistics
      const stats = {
        totalTeams: teams.length,
        totalPlayers: players.length,
        totalMatches: matches.length,
        activePlayers: players.filter(p => p.active).length,
        completedMatches: matches.filter(m => m.status === 'completed').length,
        upcomingMatches: matches.filter(m => m.status === 'scheduled').length,
        winRate: this.calculateWinRate(matches, teamIds),
        averageGoalsPerMatch: this.calculateAverageGoals(matches),
        topScorer: this.getTopScorer(players, matches),
        recentActivity: await this.getRecentActivity(userId, period)
      };

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getTeamAnalytics(teamId, userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month' } = options;

      // Verify team belongs to user
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .eq('user_id', userId)
        .single();

      if (teamError || !team) {
        throw new Error('Team not found or access denied');
      }

      // Get team matches
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('team_id', teamId);

      if (matchesError) throw matchesError;

      // Get team players
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId);

      if (playersError) throw playersError;

      // Get match events
      const { data: events, error: eventsError } = await supabase
        .from('match_events')
        .select('*')
        .eq('team_id', teamId);

      if (eventsError) throw eventsError;

      const analytics = {
        team: team,
        overview: {
          totalMatches: matches.length,
          wins: matches.filter(m => m.result === 'win').length,
          losses: matches.filter(m => m.result === 'loss').length,
          draws: matches.filter(m => m.result === 'draw').length,
          winRate: this.calculateWinRate(matches, [teamId]),
          totalGoals: this.calculateTotalGoals(events),
          totalAssists: this.calculateTotalAssists(events),
          averageGoalsPerMatch: this.calculateAverageGoals(matches)
        },
        players: {
          total: players.length,
          active: players.filter(p => p.active).length,
          byPosition: this.groupPlayersByPosition(players),
          topPerformers: this.getTopPerformers(players, events)
        },
        matches: {
          recent: matches.slice(-5),
          upcoming: matches.filter(m => m.status === 'scheduled').slice(0, 5),
          performance: this.analyzeMatchPerformance(matches)
        },
        trends: await this.getTeamTrends(teamId, period)
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching team analytics:', error);
      throw error;
    }
  }

  async getPlayerAnalytics(playerId, userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month' } = options;

      // Verify player belongs to user
      const { data: player, error: playerError } = await supabase
        .from('players')
        .select(`
          *,
          teams!inner(id, name, user_id)
        `)
        .eq('id', playerId)
        .eq('teams.user_id', userId)
        .single();

      if (playerError || !player) {
        throw new Error('Player not found or access denied');
      }

      // Get player events
      const { data: events, error: eventsError } = await supabase
        .from('match_events')
        .select('*')
        .eq('player_id', playerId);

      if (eventsError) throw eventsError;

      // Get player matches
      const matchIds = [...new Set(events.map(e => e.match_id))];
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .in('id', matchIds);

      if (matchesError) throw matchesError;

      const analytics = {
        player: player,
        stats: this.calculatePlayerStats(events),
        performance: {
          goals: events.filter(e => e.event_type === 'goal').length,
          assists: events.filter(e => e.event_type === 'assist').length,
          yellowCards: events.filter(e => e.event_type === 'yellow_card').length,
          redCards: events.filter(e => e.event_type === 'red_card').length,
          minutes: events.reduce((sum, e) => sum + (e.minutes || 0), 0),
          matches: matchIds.length
        },
        trends: await this.getPlayerTrends(playerId, period),
        recentMatches: matches.slice(-5),
        achievements: this.getPlayerAchievements(events)
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching player analytics:', error);
      throw error;
    }
  }

  async getMatchAnalytics(userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month', teamId } = options;

      let query = supabase
        .from('matches')
        .select(`
          *,
          teams!inner(id, name, user_id)
        `)
        .eq('teams.user_id', userId);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data: matches, error } = await query;

      if (error) throw error;

      const analytics = {
        totalMatches: matches.length,
        completedMatches: matches.filter(m => m.status === 'completed').length,
        scheduledMatches: matches.filter(m => m.status === 'scheduled').length,
        averageGoals: this.calculateAverageGoals(matches),
        winRate: this.calculateWinRate(matches, teamId ? [teamId] : null),
        matchDistribution: this.getMatchDistribution(matches),
        recentMatches: matches.slice(-10),
        upcomingMatches: matches.filter(m => m.status === 'scheduled').slice(0, 10)
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching match analytics:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month', teamId, playerId } = options;

      let eventsQuery = supabase
        .from('match_events')
        .select(`
          *,
          matches!inner(team_id, teams!inner(user_id))
        `)
        .eq('matches.teams.user_id', userId);

      if (teamId) {
        eventsQuery = eventsQuery.eq('team_id', teamId);
      }

      if (playerId) {
        eventsQuery = eventsQuery.eq('player_id', playerId);
      }

      const { data: events, error } = await eventsQuery;

      if (error) throw error;

      const metrics = {
        goals: events.filter(e => e.event_type === 'goal').length,
        assists: events.filter(e => e.event_type === 'assist').length,
        shots: events.filter(e => e.event_type === 'shot').length,
        shotsOnTarget: events.filter(e => e.event_type === 'shot' && e.result === 'on_target').length,
        passes: events.filter(e => e.event_type === 'pass').length,
        passesCompleted: events.filter(e => e.event_type === 'pass' && e.result === 'completed').length,
        tackles: events.filter(e => e.event_type === 'tackle').length,
        tacklesWon: events.filter(e => e.event_type === 'tackle' && e.result === 'won').length,
        fouls: events.filter(e => e.event_type === 'foul').length,
        yellowCards: events.filter(e => e.event_type === 'yellow_card').length,
        redCards: events.filter(e => e.event_type === 'red_card').length,
        accuracy: {
          shots: this.calculateAccuracy(events, 'shot', 'on_target'),
          passes: this.calculateAccuracy(events, 'pass', 'completed'),
          tackles: this.calculateAccuracy(events, 'tackle', 'won')
        }
      };

      return metrics;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  async getAttendanceAnalytics(userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month', teamId } = options;

      let query = supabase
        .from('attendance')
        .select(`
          *,
          players!inner(team_id, teams!inner(user_id))
        `)
        .eq('players.teams.user_id', userId);

      if (teamId) {
        query = query.eq('players.team_id', teamId);
      }

      const { data: attendance, error } = await query;

      if (error) throw error;

      const analytics = {
        totalSessions: attendance.length,
        averageAttendance: this.calculateAverageAttendance(attendance),
        attendanceRate: this.calculateAttendanceRate(attendance),
        topAttendees: this.getTopAttendees(attendance),
        attendanceTrends: this.getAttendanceTrends(attendance, period)
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching attendance analytics:', error);
      throw error;
    }
  }

  async getGoalAnalytics(userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month', teamId, playerId } = options;

      let query = supabase
        .from('match_events')
        .select(`
          *,
          matches!inner(team_id, teams!inner(user_id))
        `)
        .eq('event_type', 'goal')
        .eq('matches.teams.user_id', userId);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      if (playerId) {
        query = query.eq('player_id', playerId);
      }

      const { data: goals, error } = await query;

      if (error) throw error;

      const analytics = {
        totalGoals: goals.length,
        goalsByPlayer: this.groupGoalsByPlayer(goals),
        goalsByMatch: this.groupGoalsByMatch(goals),
        goalTypes: this.analyzeGoalTypes(goals),
        scoringTrends: this.getScoringTrends(goals, period)
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching goal analytics:', error);
      throw error;
    }
  }

  async getAssistAnalytics(userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month', teamId, playerId } = options;

      let query = supabase
        .from('match_events')
        .select(`
          *,
          matches!inner(team_id, teams!inner(user_id))
        `)
        .eq('event_type', 'assist')
        .eq('matches.teams.user_id', userId);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      if (playerId) {
        query = query.eq('player_id', playerId);
      }

      const { data: assists, error } = await query;

      if (error) throw error;

      const analytics = {
        totalAssists: assists.length,
        assistsByPlayer: this.groupAssistsByPlayer(assists),
        assistsByMatch: this.groupAssistsByMatch(assists),
        assistTypes: this.analyzeAssistTypes(assists),
        assistTrends: this.getAssistTrends(assists, period)
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching assist analytics:', error);
      throw error;
    }
  }

  async getDisciplineAnalytics(userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month', teamId, playerId } = options;

      let query = supabase
        .from('match_events')
        .select(`
          *,
          matches!inner(team_id, teams!inner(user_id))
        `)
        .in('event_type', ['yellow_card', 'red_card', 'foul'])
        .eq('matches.teams.user_id', userId);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      if (playerId) {
        query = query.eq('player_id', playerId);
      }

      const { data: discipline, error } = await query;

      if (error) throw error;

      const analytics = {
        totalFouls: discipline.filter(e => e.event_type === 'foul').length,
        yellowCards: discipline.filter(e => e.event_type === 'yellow_card').length,
        redCards: discipline.filter(e => e.event_type === 'red_card').length,
        disciplineByPlayer: this.groupDisciplineByPlayer(discipline),
        disciplineTrends: this.getDisciplineTrends(discipline, period)
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching discipline analytics:', error);
      throw error;
    }
  }

  async getTrendAnalysis(userId, options = {}) {
    try {
      const { startDate, endDate, period = 'month', teamId, metric } = options;

      // Get data based on metric
      let data;
      switch (metric) {
        case 'goals':
          data = await this.getGoalData(userId, teamId, period);
          break;
        case 'assists':
          data = await this.getAssistData(userId, teamId, period);
          break;
        case 'attendance':
          data = await this.getAttendanceData(userId, teamId, period);
          break;
        default:
          data = await this.getGeneralData(userId, teamId, period);
      }

      const trends = {
        metric,
        period,
        data: data,
        trend: this.calculateTrend(data),
        forecast: this.generateForecast(data)
      };

      return trends;
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
      throw error;
    }
  }

  async getComparisonAnalytics(userId, options = {}) {
    try {
      const { teamIds, playerIds, metric, period = 'month' } = options;

      const comparisons = [];

      if (teamIds && teamIds.length > 0) {
        for (const teamId of teamIds) {
          const teamData = await this.getTeamAnalytics(teamId, userId, { period });
          comparisons.push({
            type: 'team',
            id: teamId,
            data: teamData
          });
        }
      }

      if (playerIds && playerIds.length > 0) {
        for (const playerId of playerIds) {
          const playerData = await this.getPlayerAnalytics(playerId, userId, { period });
          comparisons.push({
            type: 'player',
            id: playerId,
            data: playerData
          });
        }
      }

      return {
        metric,
        period,
        comparisons
      };
    } catch (error) {
      console.error('Error fetching comparison analytics:', error);
      throw error;
    }
  }

  async exportAnalytics(userId, options = {}) {
    try {
      const { type = 'dashboard', format = 'csv', startDate, endDate, teamId, playerId, metrics = [] } = options;

      let data;
      switch (type) {
        case 'dashboard':
          data = await this.getDashboardStats(userId, { startDate, endDate });
          break;
        case 'team':
          if (!teamId) throw new Error('Team ID required for team export');
          data = await this.getTeamAnalytics(teamId, userId, { startDate, endDate });
          break;
        case 'player':
          if (!playerId) throw new Error('Player ID required for player export');
          data = await this.getPlayerAnalytics(playerId, userId, { startDate, endDate });
          break;
        default:
          throw new Error('Invalid export type');
      }

      // Convert to requested format
      let exportData;
      switch (format) {
        case 'csv':
          exportData = this.convertToCSV(data);
          break;
        case 'json':
          exportData = JSON.stringify(data, null, 2);
          break;
        case 'excel':
          exportData = await this.convertToExcel(data);
          break;
        default:
          throw new Error('Unsupported export format');
      }

      return {
        type,
        format,
        data: exportData,
        filename: `analytics_${type}_${new Date().toISOString().split('T')[0]}.${format}`
      };
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  }

  async getAvailableReports(userId, options = {}) {
    try {
      const { teamId } = options;

      const reports = [
        {
          id: 'dashboard',
          name: 'Dashboard Overview',
          description: 'Complete dashboard statistics and metrics',
          type: 'dashboard'
        },
        {
          id: 'team_performance',
          name: 'Team Performance Report',
          description: 'Detailed team performance analysis',
          type: 'team',
          requiresTeamId: true
        },
        {
          id: 'player_performance',
          name: 'Player Performance Report',
          description: 'Individual player performance analysis',
          type: 'player',
          requiresPlayerId: true
        },
        {
          id: 'match_analysis',
          name: 'Match Analysis Report',
          description: 'Comprehensive match statistics and analysis',
          type: 'match'
        },
        {
          id: 'attendance_report',
          name: 'Attendance Report',
          description: 'Player attendance and participation analysis',
          type: 'attendance'
        }
      ];

      return reports;
    } catch (error) {
      console.error('Error fetching available reports:', error);
      throw error;
    }
  }

  async generateCustomReport(userId, reportData) {
    try {
      const { name, description, type, parameters, schedule } = reportData;

      // Validate parameters
      if (!name || !type) {
        throw new Error('Report name and type are required');
      }

      // Generate report based on type
      let reportContent;
      switch (type) {
        case 'dashboard':
          reportContent = await this.getDashboardStats(userId, parameters);
          break;
        case 'team':
          reportContent = await this.getTeamAnalytics(parameters.teamId, userId, parameters);
          break;
        case 'player':
          reportContent = await this.getPlayerAnalytics(parameters.playerId, userId, parameters);
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Save report
      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: userId,
          name,
          description,
          type,
          parameters,
          content: reportContent,
          schedule,
          generated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw error;
    }
  }

  async getAIInsights(userId, options = {}) {
    try {
      const { startDate, endDate, teamId, playerId } = options;

      // Get relevant data
      const dashboardStats = await this.getDashboardStats(userId, { startDate, endDate });
      const performanceMetrics = await this.getPerformanceMetrics(userId, { startDate, endDate, teamId, playerId });

      // Generate AI insights (this would integrate with your AI service)
      const insights = [
        {
          type: 'performance',
          title: 'Performance Trend',
          description: 'Your team has shown a 15% improvement in goal scoring over the last month.',
          confidence: 0.85,
          actionable: true,
          action: 'Consider focusing on finishing drills in training.'
        },
        {
          type: 'attendance',
          title: 'Attendance Pattern',
          description: 'Player attendance has been consistent at 92% over the last 4 weeks.',
          confidence: 0.92,
          actionable: false
        },
        {
          type: 'tactical',
          title: 'Tactical Suggestion',
          description: 'Your team performs better when playing with 4-3-3 formation.',
          confidence: 0.78,
          actionable: true,
          action: 'Consider using 4-3-3 formation more frequently.'
        }
      ];

      return {
        insights,
        summary: {
          totalInsights: insights.length,
          actionableInsights: insights.filter(i => i.actionable).length,
          averageConfidence: (insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length).toFixed(2)
        }
      };
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      throw error;
    }
  }

  async getPerformancePredictions(userId, options = {}) {
    try {
      const { teamId, playerId, horizon = 30 } = options;

      // Get historical data
      const historicalData = await this.getHistoricalData(userId, teamId, playerId);

      // Generate predictions (this would use ML models)
      const predictions = {
        nextMatch: {
          winProbability: 0.65,
          predictedScore: '2-1',
          confidence: 0.72
        },
        seasonEnd: {
          predictedPosition: 3,
          predictedPoints: 68,
          confidence: 0.58
        },
        playerPerformance: playerId ? {
          predictedGoals: 12,
          predictedAssists: 8,
          confidence: 0.75
        } : null
      };

      return {
        horizon,
        predictions,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching performance predictions:', error);
      throw error;
    }
  }

  async getPerformanceBenchmarks(userId, options = {}) {
    try {
      const { teamId, playerId, position, ageGroup } = options;

      // Get benchmark data (this would come from a larger dataset)
      const benchmarks = {
        team: {
          averageGoalsPerMatch: 1.8,
          averagePossession: 52.5,
          averagePassAccuracy: 78.3,
          averageTackleSuccess: 71.2
        },
        player: position ? {
          [position]: {
            averageGoals: 8.5,
            averageAssists: 6.2,
            averageMinutes: 85,
            averagePassAccuracy: 82.1
          }
        } : null,
        ageGroup: ageGroup ? {
          [ageGroup]: {
            averageGoals: 6.8,
            averageAssists: 5.1,
            averageMinutes: 78
          }
        } : null
      };

      return benchmarks;
    } catch (error) {
      console.error('Error fetching performance benchmarks:', error);
      throw error;
    }
  }

  // Helper methods
  calculateWinRate(matches, teamIds = null) {
    if (!matches || matches.length === 0) return 0;
    
    const relevantMatches = teamIds 
      ? matches.filter(m => teamIds.includes(m.team_id))
      : matches;
    
    const wins = relevantMatches.filter(m => m.result === 'win').length;
    return ((wins / relevantMatches.length) * 100).toFixed(1);
  }

  calculateAverageGoals(matches) {
    if (!matches || matches.length === 0) return 0;
    
    const totalGoals = matches.reduce((sum, match) => {
      return sum + (match.home_score || 0) + (match.away_score || 0);
    }, 0);
    
    return (totalGoals / matches.length).toFixed(1);
  }

  calculateTotalGoals(events) {
    return events.filter(e => e.event_type === 'goal').length;
  }

  calculateTotalAssists(events) {
    return events.filter(e => e.event_type === 'assist').length;
  }

  groupPlayersByPosition(players) {
    return players.reduce((acc, player) => {
      const position = player.position || 'unknown';
      acc[position] = (acc[position] || 0) + 1;
      return acc;
    }, {});
  }

  getTopPerformers(players, events) {
    const playerStats = players.map(player => {
      const playerEvents = events.filter(e => e.player_id === player.id);
      return {
        player,
        goals: playerEvents.filter(e => e.event_type === 'goal').length,
        assists: playerEvents.filter(e => e.event_type === 'assist').length
      };
    });

    return playerStats
      .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
      .slice(0, 5);
  }

  analyzeMatchPerformance(matches) {
    return {
      homeWins: matches.filter(m => m.result === 'win' && m.is_home).length,
      awayWins: matches.filter(m => m.result === 'win' && !m.is_home).length,
      draws: matches.filter(m => m.result === 'draw').length,
      losses: matches.filter(m => m.result === 'loss').length
    };
  }

  calculateAccuracy(events, eventType, successResult) {
    const total = events.filter(e => e.event_type === eventType).length;
    const successful = events.filter(e => e.event_type === eventType && e.result === successResult).length;
    return total > 0 ? ((successful / total) * 100).toFixed(1) : 0;
  }

  getTopScorer(players, matches) {
    // This would need to be implemented based on your data structure
    return null;
  }

  async getRecentActivity(userId, period) {
    // This would fetch recent activity from various tables
    return [];
  }

  async getTeamTrends(teamId, period) {
    // This would analyze trends over time
    return [];
  }

  async getPlayerTrends(playerId, period) {
    // This would analyze player trends over time
    return [];
  }

  getPlayerAchievements(events) {
    // This would calculate player achievements
    return [];
  }

  getMatchDistribution(matches) {
    // This would analyze match distribution
    return {};
  }

  groupGoalsByPlayer(goals) {
    // This would group goals by player
    return {};
  }

  groupGoalsByMatch(goals) {
    // This would group goals by match
    return {};
  }

  analyzeGoalTypes(goals) {
    // This would analyze goal types
    return {};
  }

  getScoringTrends(goals, period) {
    // This would analyze scoring trends
    return [];
  }

  groupAssistsByPlayer(assists) {
    // This would group assists by player
    return {};
  }

  groupAssistsByMatch(assists) {
    // This would group assists by match
    return {};
  }

  analyzeAssistTypes(assists) {
    // This would analyze assist types
    return {};
  }

  getAssistTrends(assists, period) {
    // This would analyze assist trends
    return [];
  }

  groupDisciplineByPlayer(discipline) {
    // This would group discipline by player
    return {};
  }

  getDisciplineTrends(discipline, period) {
    // This would analyze discipline trends
    return [];
  }

  calculateAverageAttendance(attendance) {
    // This would calculate average attendance
    return 0;
  }

  calculateAttendanceRate(attendance) {
    // This would calculate attendance rate
    return 0;
  }

  getTopAttendees(attendance) {
    // This would get top attendees
    return [];
  }

  getAttendanceTrends(attendance, period) {
    // This would analyze attendance trends
    return [];
  }

  async getGoalData(userId, teamId, period) {
    // This would get goal data
    return [];
  }

  async getAssistData(userId, teamId, period) {
    // This would get assist data
    return [];
  }

  async getAttendanceData(userId, teamId, period) {
    // This would get attendance data
    return [];
  }

  async getGeneralData(userId, teamId, period) {
    // This would get general data
    return [];
  }

  calculateTrend(data) {
    // This would calculate trend
    return 'stable';
  }

  generateForecast(data) {
    // This would generate forecast
    return [];
  }

  async getHistoricalData(userId, teamId, playerId) {
    // This would get historical data
    return [];
  }

  convertToCSV(data) {
    // This would convert data to CSV
    return '';
  }

  async convertToExcel(data) {
    // This would convert data to Excel
    return Buffer.from('');
  }
}

module.exports = AnalyticsService; 