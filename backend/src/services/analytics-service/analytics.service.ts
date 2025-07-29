import { v4 as uuidv4 } from 'uuid';
import { config } from '../../shared/config';
import { ApiError } from '../../shared/utils/ApiError';
import { logger } from '../../shared/utils/logger';
import { AnalyticsRepository } from './analytics.repository';
import { CacheService } from '../../shared/services/cache.service';

export interface AnalyticsReport {
  id: string;
  type: 'team_performance' | 'player_analysis' | 'match_analysis' | 'season_summary';
  entityType: 'team' | 'player' | 'match';
  entityId: string;
  data: AnalyticsData;
  metadata: AnalyticsMetadata;
  createdAt: Date;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  metrics: AnalyticsMetrics;
  trends: AnalyticsTrends;
  insights: string[];
  recommendations: string[];
}

export interface AnalyticsSummary {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  winPercentage: number;
  averageGoalsPerMatch: number;
}

export interface AnalyticsMetrics {
  possession: {
    average: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  shots: {
    total: number;
    onTarget: number;
    accuracy: number;
  };
  passes: {
    total: number;
    accuracy: number;
    keyPasses: number;
  };
  defensive: {
    cleanSheets: number;
    tacklesWon: number;
    interceptions: number;
  };
  discipline: {
    yellowCards: number;
    redCards: number;
    foulsCommitted: number;
    foulsReceived: number;
  };
}

export interface AnalyticsTrends {
  performance: Array<{ period: string; value: number }>;
  goals: Array<{ period: string; for: number; against: number }>;
  form: Array<{ match: string; result: 'W' | 'D' | 'L'; score: string }>;
}

export interface AnalyticsMetadata {
  sport: 'soccer' | 'futsal';
  season: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  filters: Record<string, any>;
}

export interface PlayerAnalytics {
  playerId: string;
  name: string;
  position: string;
  performance: {
    rating: number;
    trend: 'improving' | 'declining' | 'stable';
    consistency: number;
  };
  statistics: {
    goals: number;
    assists: number;
    shots: number;
    passes: number;
    tackles: number;
    interceptions: number;
  };
  heatMap: Array<{ zone: string; intensity: number }>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export class AnalyticsService {
  private analyticsRepository: AnalyticsRepository;
  private cacheService: CacheService;

  constructor() {
    this.analyticsRepository = new AnalyticsRepository();
    this.cacheService = new CacheService();
  }

  async generateTeamAnalytics(teamId: string, filters: any = {}): Promise<AnalyticsReport> {
    try {
      logger.info(`Generating team analytics for team: ${teamId}`);

      // Check cache first
      const cacheKey = `team_analytics:${teamId}:${JSON.stringify(filters)}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached as AnalyticsReport;
      }

      // Generate analytics data
      const data = await this.calculateTeamAnalytics(teamId, filters);
      
      const report: AnalyticsReport = {
        id: uuidv4(),
        type: 'team_performance',
        entityType: 'team',
        entityId: teamId,
        data,
        metadata: {
          sport: filters.sport || 'soccer',
          season: filters.season || '2024/25',
          dateRange: {
            from: filters.dateFrom || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            to: filters.dateTo || new Date()
          },
          filters
        },
        createdAt: new Date()
      };

      // Save to database
      await this.analyticsRepository.create(report);

      // Cache for 1 hour
      await this.cacheService.set(cacheKey, report, 3600);

      logger.info(`Team analytics generated: ${report.id}`);
      return report;
    } catch (error) {
      logger.error('Error generating team analytics:', error);
      throw error;
    }
  }

  async generatePlayerAnalytics(playerId: string, filters: any = {}): Promise<PlayerAnalytics> {
    try {
      logger.info(`Generating player analytics for player: ${playerId}`);

      // Check cache first
      const cacheKey = `player_analytics:${playerId}:${JSON.stringify(filters)}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached as PlayerAnalytics;
      }

      const analytics = await this.calculatePlayerAnalytics(playerId, filters);

      // Cache for 30 minutes
      await this.cacheService.set(cacheKey, analytics, 1800);

      logger.info(`Player analytics generated for: ${playerId}`);
      return analytics;
    } catch (error) {
      logger.error('Error generating player analytics:', error);
      throw error;
    }
  }

  async getAnalyticsReports(filters: any = {}): Promise<AnalyticsReport[]> {
    try {
      return await this.analyticsRepository.findMany(filters);
    } catch (error) {
      logger.error('Error getting analytics reports:', error);
      throw error;
    }
  }

  async getRealtimeAnalytics(matchId: string): Promise<any> {
    try {
      // Generate real-time match analytics
      return await this.calculateRealtimeMatchAnalytics(matchId);
    } catch (error) {
      logger.error('Error getting realtime analytics:', error);
      throw error;
    }
  }

  private async calculateTeamAnalytics(teamId: string, filters: any): Promise<AnalyticsData> {
    // Mock implementation - in production, this would query actual match data
    return {
      summary: {
        totalMatches: 24,
        wins: 16,
        draws: 4,
        losses: 4,
        goalsFor: 48,
        goalsAgainst: 22,
        winPercentage: 66.7,
        averageGoalsPerMatch: 2.0
      },
      metrics: {
        possession: {
          average: 58.5,
          trend: 'improving'
        },
        shots: {
          total: 312,
          onTarget: 156,
          accuracy: 50.0
        },
        passes: {
          total: 12450,
          accuracy: 84.2,
          keyPasses: 245
        },
        defensive: {
          cleanSheets: 12,
          tacklesWon: 156,
          interceptions: 89
        },
        discipline: {
          yellowCards: 34,
          redCards: 3,
          foulsCommitted: 156,
          foulsReceived: 189
        }
      },
      trends: {
        performance: [
          { period: 'Aug', value: 65 },
          { period: 'Sep', value: 72 },
          { period: 'Oct', value: 68 },
          { period: 'Nov', value: 75 },
          { period: 'Dec', value: 78 }
        ],
        goals: [
          { period: 'Aug', for: 8, against: 4 },
          { period: 'Sep', for: 12, against: 6 },
          { period: 'Oct', for: 10, against: 5 },
          { period: 'Nov', for: 9, against: 3 },
          { period: 'Dec', for: 9, against: 4 }
        ],
        form: [
          { match: 'vs Team A', result: 'W', score: '2-1' },
          { match: 'vs Team B', result: 'W', score: '3-0' },
          { match: 'vs Team C', result: 'D', score: '1-1' },
          { match: 'vs Team D', result: 'W', score: '2-0' },
          { match: 'vs Team E', result: 'L', score: '0-2' }
        ]
      },
      insights: [
        'Team shows strong attacking form with consistent goal scoring',
        'Defensive stability has improved significantly over the season',
        'Possession-based play style is becoming more effective',
        'Set piece conversion rate needs improvement'
      ],
      recommendations: [
        'Focus on set piece training to improve conversion rate',
        'Maintain current defensive structure and organization',
        'Continue developing possession-based attacking patterns',
        'Work on finishing in the final third'
      ]
    };
  }

  private async calculatePlayerAnalytics(playerId: string, filters: any): Promise<PlayerAnalytics> {
    // Mock implementation - in production, this would query actual player data
    return {
      playerId,
      name: 'Player Name',
      position: 'Midfielder',
      performance: {
        rating: 7.8,
        trend: 'improving',
        consistency: 85
      },
      statistics: {
        goals: 8,
        assists: 12,
        shots: 45,
        passes: 1250,
        tackles: 34,
        interceptions: 28
      },
      heatMap: [
        { zone: 'central_midfield', intensity: 85 },
        { zone: 'attacking_third', intensity: 65 },
        { zone: 'defensive_third', intensity: 45 }
      ],
      strengths: [
        'Excellent passing accuracy',
        'Strong defensive work rate',
        'Good positioning sense'
      ],
      weaknesses: [
        'Needs to improve shooting accuracy',
        'Could be more aggressive in tackles'
      ],
      recommendations: [
        'Practice shooting drills to improve accuracy',
        'Work on timing of defensive challenges',
        'Continue developing creative passing'
      ]
    };
  }

  private async calculateRealtimeMatchAnalytics(matchId: string): Promise<any> {
    // Mock real-time analytics
    return {
      matchId,
      currentMinute: 67,
      momentum: {
        home: 65,
        away: 35
      },
      keyEvents: [
        { minute: 23, type: 'goal', team: 'home', impact: 'high' },
        { minute: 45, type: 'yellow_card', team: 'away', impact: 'medium' },
        { minute: 67, type: 'substitution', team: 'home', impact: 'medium' }
      ],
      predictions: {
        finalScore: { home: 2.1, away: 1.3 },
        nextGoal: { home: 0.6, away: 0.4 },
        cards: { home: 0.3, away: 0.7 }
      }
    };
  }
}