/**
 * Analytics Service
 * Provides comprehensive analytics and reporting functionality
 */

import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import { getEnv, getEnvNumber } from '../../../src/utils/envValidation.js';

interface AnalyticsEvent {
  id?: string;
  userId?: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  totalPlayers: number;
  averageMatchDuration: number;
  popularSports: Array<{ sport: string; count: number }>;
  userEngagement: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  performance: {
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

interface UserAnalytics {
  userId: string;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  averageScore: number;
  favoriteSport: string;
  lastActive: Date;
  totalPlayTime: number;
  achievements: string[];
  rank: number;
}

interface MatchAnalytics {
  matchId: string;
  sport: string;
  duration: number;
  playerCount: number;
  averageScore: number;
  totalGoals: number;
  possession: {
    team1: number;
    team2: number;
  };
  shots: {
    team1: number;
    team2: number;
  };
  passes: {
    team1: number;
    team2: number;
  };
  fouls: {
    team1: number;
    team2: number;
  };
  cards: {
    yellow: number;
    red: number;
  };
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track an analytics event
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: event.userId,
          event_type: event.eventType,
          event_data: event.eventData,
          timestamp: event.timestamp.toISOString(),
          session_id: event.sessionId,
          user_agent: event.userAgent,
          ip_address: event.ipAddress,
          metadata: event.metadata
        });

      if (error) {
        logger.error('Failed to track analytics event:', error);
        throw error;
      }

      logger.info(`Analytics event tracked: ${event.eventType}`, {
        userId: event.userId,
        eventType: event.eventType
      });
    } catch (error) {
      logger.error('Error tracking analytics event:', error);
      throw error;
    }
  }

  /**
   * Get platform-wide analytics metrics
   */
  async getPlatformMetrics(timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<AnalyticsMetrics> {
    const cacheKey = `platform_metrics_${timeRange}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const startDate = this.getStartDate(timeRange);

      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get active users
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', startDate.toISOString());

      // Get total matches
      const { count: totalMatches } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

      // Get total players
      const { count: totalPlayers } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true });

      // Get average match duration
      const { data: matchDurations } = await supabase
        .from('matches')
        .select('duration')
        .not('duration', 'is', null);

      const averageMatchDuration = matchDurations?.length 
        ? matchDurations.reduce((sum, match) => sum + (match.duration || 0), 0) / matchDurations.length
        : 0;

      // Get popular sports
      const { data: sportStats } = await supabase
        .from('matches')
        .select('sport')
        .gte('created_at', startDate.toISOString());

      const sportCounts = sportStats?.reduce((acc, match) => {
        acc[match.sport] = (acc[match.sport] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const popularSports = Object.entries(sportCounts)
        .map(([sport, count]) => ({ sport, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get user engagement
      const userEngagement = await this.calculateUserEngagement(startDate);

      // Get performance metrics
      const performance = await this.calculatePerformanceMetrics(startDate);

      const metrics: AnalyticsMetrics = {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalMatches: totalMatches || 0,
        totalPlayers: totalPlayers || 0,
        averageMatchDuration,
        popularSports,
        userEngagement,
        performance
      };

      this.setCache(cacheKey, metrics);
      return metrics;
    } catch (error) {
      logger.error('Error getting platform metrics:', error);
      throw error;
    }
  }

  /**
   * Get user-specific analytics
   */
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const cacheKey = `user_analytics_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Get user's matches
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .or(`team1_players.cs.{${userId}},team2_players.cs.{${userId}}`);

      // Get user's wins and losses
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Calculate analytics
      const totalMatches = matches?.length || 0;
      const totalWins = userStats?.wins || 0;
      const totalLosses = userStats?.losses || 0;
      const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;

      // Get average score
      const { data: scores } = await supabase
        .from('match_scores')
        .select('score')
        .eq('user_id', userId);

      const averageScore = scores?.length 
        ? scores.reduce((sum, score) => sum + (score.score || 0), 0) / scores.length
        : 0;

      // Get favorite sport
      const sportCounts = matches?.reduce((acc, match) => {
        acc[match.sport] = (acc[match.sport] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const favoriteSport = Object.entries(sportCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown';

      // Get last active
      const { data: lastActivity } = await supabase
        .from('analytics_events')
        .select('timestamp')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      // Get total play time
      const totalPlayTime = matches?.reduce((sum, match) => sum + (match.duration || 0), 0) || 0;

      // Get achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('achievement_type')
        .eq('user_id', userId);

      // Calculate rank
      const rank = await this.calculateUserRank(userId);

      const userAnalytics: UserAnalytics = {
        userId,
        totalMatches,
        totalWins,
        totalLosses,
        winRate,
        averageScore,
        favoriteSport,
        lastActive: lastActivity?.timestamp ? new Date(lastActivity.timestamp) : new Date(),
        totalPlayTime,
        achievements: achievements?.map(a => a.achievement_type) || [],
        rank
      };

      this.setCache(cacheKey, userAnalytics);
      return userAnalytics;
    } catch (error) {
      logger.error('Error getting user analytics:', error);
      throw error;
    }
  }

  /**
   * Get match-specific analytics
   */
  async getMatchAnalytics(matchId: string): Promise<MatchAnalytics> {
    const cacheKey = `match_analytics_${matchId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Get match data
      const { data: match } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (!match) {
        throw new Error('Match not found');
      }

      // Get match statistics
      const { data: stats } = await supabase
        .from('match_statistics')
        .select('*')
        .eq('match_id', matchId)
        .single();

      // Get player scores
      const { data: scores } = await supabase
        .from('match_scores')
        .select('score')
        .eq('match_id', matchId);

      const averageScore = scores?.length 
        ? scores.reduce((sum, score) => sum + (score.score || 0), 0) / scores.length
        : 0;

      const matchAnalytics: MatchAnalytics = {
        matchId,
        sport: match.sport,
        duration: match.duration || 0,
        playerCount: match.team1_players?.length + match.team2_players?.length || 0,
        averageScore,
        totalGoals: stats?.total_goals || 0,
        possession: {
          team1: stats?.team1_possession || 0,
          team2: stats?.team2_possession || 0
        },
        shots: {
          team1: stats?.team1_shots || 0,
          team2: stats?.team2_shots || 0
        },
        passes: {
          team1: stats?.team1_passes || 0,
          team2: stats?.team2_passes || 0
        },
        fouls: {
          team1: stats?.team1_fouls || 0,
          team2: stats?.team2_fouls || 0
        },
        cards: {
          yellow: stats?.yellow_cards || 0,
          red: stats?.red_cards || 0
        }
      };

      this.setCache(cacheKey, matchAnalytics);
      return matchAnalytics;
    } catch (error) {
      logger.error('Error getting match analytics:', error);
      throw error;
    }
  }

  /**
   * Generate analytics report
   */
  async generateReport(
    reportType: 'user' | 'match' | 'platform',
    filters: Record<string, any> = {},
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<any> {
    try {
      let data: any;

      switch (reportType) {
        case 'user':
          if (filters.userId) {
            data = await this.getUserAnalytics(filters.userId);
          } else {
            // Get multiple users
            const { data: users } = await supabase
              .from('users')
              .select('id')
              .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 10) - 1);

            data = await Promise.all(
              users?.map(user => this.getUserAnalytics(user.id)) || []
            );
          }
          break;

        case 'match':
          if (filters.matchId) {
            data = await this.getMatchAnalytics(filters.matchId);
          } else {
            // Get multiple matches
            const { data: matches } = await supabase
              .from('matches')
              .select('id')
              .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 10) - 1);

            data = await Promise.all(
              matches?.map(match => this.getMatchAnalytics(match.id)) || []
            );
          }
          break;

        case 'platform':
          data = await this.getPlatformMetrics(filters.timeRange);
          break;

        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }

      // Format the data
      switch (format) {
        case 'json':
          return data;
        case 'csv':
          return this.convertToCSV(data);
        case 'pdf':
          return this.convertToPDF(data, reportType);
        default:
          return data;
      }
    } catch (error) {
      logger.error('Error generating analytics report:', error);
      throw error;
    }
  }

  /**
   * Export analytics data
   */
  async exportData(
    dataType: 'events' | 'users' | 'matches',
    filters: Record<string, any> = {},
    format: 'json' | 'csv' = 'json'
  ): Promise<any> {
    try {
      let query = supabase.from(`analytics_${dataType}`).select('*');

      // Apply filters
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return format === 'csv' ? this.convertToCSV(data) : data;
    } catch (error) {
      logger.error('Error exporting analytics data:', error);
      throw error;
    }
  }

  /**
   * Calculate user engagement metrics
   */
  private async calculateUserEngagement(startDate: Date): Promise<AnalyticsMetrics['userEngagement']> {
    try {
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { count: daily } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', dayAgo.toISOString());

      const { count: weekly } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', weekAgo.toISOString());

      const { count: monthly } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', monthAgo.toISOString());

      return {
        daily: daily || 0,
        weekly: weekly || 0,
        monthly: monthly || 0
      };
    } catch (error) {
      logger.error('Error calculating user engagement:', error);
      return { daily: 0, weekly: 0, monthly: 0 };
    }
  }

  /**
   * Calculate performance metrics
   */
  private async calculatePerformanceMetrics(startDate: Date): Promise<AnalyticsMetrics['performance']> {
    try {
      // This would typically come from monitoring/logging systems
      // For now, return placeholder values
      return {
        averageResponseTime: 150, // ms
        errorRate: 0.5, // percentage
        uptime: 99.9 // percentage
      };
    } catch (error) {
      logger.error('Error calculating performance metrics:', error);
      return { averageResponseTime: 0, errorRate: 0, uptime: 0 };
    }
  }

  /**
   * Calculate user rank
   */
  private async calculateUserRank(userId: string): Promise<number> {
    try {
      const { data: allUsers } = await supabase
        .from('user_stats')
        .select('user_id, wins, losses')
        .order('wins', { ascending: false });

      if (!allUsers) return 0;

      const userIndex = allUsers.findIndex(user => user.user_id === userId);
      return userIndex >= 0 ? userIndex + 1 : 0;
    } catch (error) {
      logger.error('Error calculating user rank:', error);
      return 0;
    }
  }

  /**
   * Get start date for time range
   */
  private getStartDate(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  /**
   * Convert data to PDF format (placeholder)
   */
  private convertToPDF(data: any, reportType: string): Buffer {
    // This would typically use a PDF generation library like PDFKit
    // For now, return a placeholder
    return Buffer.from(`PDF Report: ${reportType} - ${JSON.stringify(data)}`);
  }

  /**
   * Clear analytics cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();

// Export for direct use
export default analyticsService; 