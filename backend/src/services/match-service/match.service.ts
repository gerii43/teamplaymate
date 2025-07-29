import { v4 as uuidv4 } from 'uuid';
import { config } from '../../shared/config';
import { ApiError } from '../../shared/utils/ApiError';
import { logger } from '../../shared/utils/logger';
import { MatchRepository } from './match.repository';
import { CacheService } from '../../shared/services/cache.service';
import { EventEmitter } from '../../shared/services/event.service';

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  score: {
    home: number;
    away: number;
    halfTime?: {
      home: number;
      away: number;
    };
  };
  events: MatchEvent[];
  statistics: MatchStatistics;
  notes: MatchNote[];
  sport: 'soccer' | 'futsal';
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'assist' | 'foul' | 'card' | 'substitution' | 'double_penalty_goal' | 'accumulated_foul';
  playerId: string;
  teamId: string;
  minute: number;
  description: string;
  goalLocation?: string;
  metadata: Record<string, any>;
}

export interface MatchStatistics {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  cards: {
    home: { yellow: number; red: number };
    away: { yellow: number; red: number };
  };
  goalLocations: {
    home: Array<{ location: string; player: string; minute: number }>;
    away: Array<{ location: string; player: string; minute: number }>;
  };
}

export interface MatchNote {
  id: string;
  minute: number;
  title: string;
  content: string;
  category: 'tactical' | 'performance' | 'injury' | 'general';
  authorId: string;
  timestamp: Date;
}

export interface CreateMatchDto {
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue: string;
  sport: 'soccer' | 'futsal';
}

export interface UpdateMatchDto {
  homeTeamId?: string;
  awayTeamId?: string;
  date?: Date;
  venue?: string;
  status?: 'scheduled' | 'live' | 'finished' | 'cancelled';
  score?: {
    home: number;
    away: number;
    halfTime?: {
      home: number;
      away: number;
    };
  };
}

export class MatchService {
  private matchRepository: MatchRepository;
  private cacheService: CacheService;
  private eventEmitter: EventEmitter;

  constructor() {
    this.matchRepository = new MatchRepository();
    this.cacheService = new CacheService();
    this.eventEmitter = new EventEmitter();
  }

  async createMatch(matchData: CreateMatchDto): Promise<Match> {
    try {
      const match = await this.matchRepository.create({
        id: uuidv4(),
        ...matchData,
        status: 'scheduled',
        score: { home: 0, away: 0 },
        events: [],
        statistics: {
          possession: { home: 0, away: 0 },
          shots: { home: 0, away: 0 },
          shotsOnTarget: { home: 0, away: 0 },
          corners: { home: 0, away: 0 },
          fouls: { home: 0, away: 0 },
          cards: {
            home: { yellow: 0, red: 0 },
            away: { yellow: 0, red: 0 }
          },
          goalLocations: { home: [], away: [] }
        },
        notes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Cache match
      await this.cacheService.set(`match:${match.id}`, match, 3600);

      // Emit match created event
      this.eventEmitter.emit('match.created', { match });

      logger.info(`Match created: ${match.id}`);
      return match;
    } catch (error) {
      logger.error('Error creating match:', error);
      throw error;
    }
  }

  async getMatches(page: number, limit: number, filters: any = {}): Promise<{
    matches: Match[];
    total: number;
  }> {
    try {
      const result = await this.matchRepository.findMany(page, limit, filters);
      return result;
    } catch (error) {
      logger.error('Error getting matches:', error);
      throw error;
    }
  }

  async getMatchById(id: string): Promise<Match | null> {
    try {
      // Try to get from cache first
      const cachedMatch = await this.cacheService.get(`match:${id}`);
      if (cachedMatch) {
        return cachedMatch as Match;
      }

      // Get from database
      const match = await this.matchRepository.findById(id);
      if (!match) {
        return null;
      }

      // Cache match
      await this.cacheService.set(`match:${id}`, match, 3600);

      return match;
    } catch (error) {
      logger.error('Error getting match by ID:', error);
      throw error;
    }
  }

  async updateMatch(id: string, updateData: UpdateMatchDto): Promise<Match> {
    try {
      const match = await this.matchRepository.update(id, {
        ...updateData,
        updatedAt: new Date()
      });

      if (!match) {
        throw new ApiError(404, 'Match not found');
      }

      // Update cache
      await this.cacheService.set(`match:${id}`, match, 3600);

      // Emit match updated event
      this.eventEmitter.emit('match.updated', { match });

      logger.info(`Match updated: ${match.id}`);
      return match;
    } catch (error) {
      logger.error('Error updating match:', error);
      throw error;
    }
  }

  async deleteMatch(id: string): Promise<void> {
    try {
      const deleted = await this.matchRepository.delete(id);
      if (!deleted) {
        throw new ApiError(404, 'Match not found');
      }

      // Remove from cache
      await this.cacheService.delete(`match:${id}`);

      // Emit match deleted event
      this.eventEmitter.emit('match.deleted', { matchId: id });

      logger.info(`Match deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting match:', error);
      throw error;
    }
  }

  async addMatchEvent(matchId: string, eventData: Omit<MatchEvent, 'id'>): Promise<MatchEvent> {
    try {
      const match = await this.getMatchById(matchId);
      if (!match) {
        throw new ApiError(404, 'Match not found');
      }

      const event: MatchEvent = {
        id: uuidv4(),
        ...eventData
      };

      match.events.push(event);

      // Update statistics based on event
      this.updateMatchStatistics(match, event);

      await this.matchRepository.update(matchId, {
        events: match.events,
        statistics: match.statistics,
        updatedAt: new Date()
      });

      // Update cache
      await this.cacheService.set(`match:${matchId}`, match, 3600);

      // Emit real-time event
      this.eventEmitter.emit('match.event', { matchId, event });

      logger.info(`Match event added: ${event.type} in match ${matchId}`);
      return event;
    } catch (error) {
      logger.error('Error adding match event:', error);
      throw error;
    }
  }

  async getMatchStatistics(matchId: string): Promise<MatchStatistics> {
    try {
      const match = await this.getMatchById(matchId);
      if (!match) {
        throw new ApiError(404, 'Match not found');
      }

      return match.statistics;
    } catch (error) {
      logger.error('Error getting match statistics:', error);
      throw error;
    }
  }

  async addMatchNote(matchId: string, noteData: Omit<MatchNote, 'id' | 'timestamp'>): Promise<MatchNote> {
    try {
      const match = await this.getMatchById(matchId);
      if (!match) {
        throw new ApiError(404, 'Match not found');
      }

      const note: MatchNote = {
        id: uuidv4(),
        ...noteData,
        timestamp: new Date()
      };

      match.notes.push(note);

      await this.matchRepository.update(matchId, {
        notes: match.notes,
        updatedAt: new Date()
      });

      // Update cache
      await this.cacheService.set(`match:${matchId}`, match, 3600);

      logger.info(`Match note added to match ${matchId}`);
      return note;
    } catch (error) {
      logger.error('Error adding match note:', error);
      throw error;
    }
  }

  async getMatchNotes(matchId: string): Promise<MatchNote[]> {
    try {
      const match = await this.getMatchById(matchId);
      if (!match) {
        throw new ApiError(404, 'Match not found');
      }

      return match.notes.sort((a, b) => a.minute - b.minute);
    } catch (error) {
      logger.error('Error getting match notes:', error);
      throw error;
    }
  }

  async startMatch(matchId: string): Promise<Match> {
    try {
      const match = await this.updateMatch(matchId, { status: 'live' });
      
      // Emit live match started event
      this.eventEmitter.emit('match.started', { match });
      
      return match;
    } catch (error) {
      logger.error('Error starting match:', error);
      throw error;
    }
  }

  async endMatch(matchId: string): Promise<Match> {
    try {
      const match = await this.updateMatch(matchId, { status: 'finished' });
      
      // Emit match ended event
      this.eventEmitter.emit('match.ended', { match });
      
      return match;
    } catch (error) {
      logger.error('Error ending match:', error);
      throw error;
    }
  }

  private updateMatchStatistics(match: Match, event: MatchEvent): void {
    const isHomeTeam = event.teamId === match.homeTeamId;
    const team = isHomeTeam ? 'home' : 'away';

    switch (event.type) {
      case 'goal':
      case 'double_penalty_goal':
        match.score[team]++;
        if (event.goalLocation) {
          match.statistics.goalLocations[team].push({
            location: event.goalLocation,
            player: event.playerId,
            minute: event.minute
          });
        }
        break;
      case 'foul':
      case 'accumulated_foul':
        match.statistics.fouls[team]++;
        break;
      case 'card':
        if (event.metadata.cardType === 'yellow') {
          match.statistics.cards[team].yellow++;
        } else if (event.metadata.cardType === 'red') {
          match.statistics.cards[team].red++;
        }
        break;
      case 'shot':
        match.statistics.shots[team]++;
        if (event.metadata.onTarget) {
          match.statistics.shotsOnTarget[team]++;
        }
        break;
      case 'corner':
        match.statistics.corners[team]++;
        break;
    }
  }
}