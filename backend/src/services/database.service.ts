import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/config';
import { logger } from '../utils/logger';

export class DatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      config.database.supabase.url,
      config.database.supabase.serviceKey
    );
  }

  async initialize(): Promise<void> {
    try {
      // Test connection
      const { data, error } = await this.supabase.from('users').select('count').limit(1);
      if (error) throw error;
      
      logger.info('Database connection established');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  // User operations
  async createUser(user: any, password?: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        ...user,
        password_hash: password
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserById(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserByEmail(email: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getUserByGoogleId(googleId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getUserWithPassword(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*, password_hash')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { ...data, password: data.password_hash };
  }

  async updateUser(id: string, updates: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Team operations
  async getUserTeams(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('teams')
      .select('*')
      .eq('coach_id', userId);

    if (error) throw error;
    return data || [];
  }

  async createTeam(team: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('teams')
      .insert(team)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Player operations
  async getUserPlayers(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('players')
      .select(`
        *,
        teams!inner(coach_id)
      `)
      .eq('teams.coach_id', userId);

    if (error) throw error;
    return data || [];
  }

  async createPlayer(player: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('players')
      .insert(player)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePlayerPhoto(playerId: string, photoUrl: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('players')
      .update({ photo_url: photoUrl })
      .eq('id', playerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Match operations
  async getUserMatches(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(name, coach_id),
        away_team:teams!matches_away_team_id_fkey(name, coach_id)
      `)
      .or(`home_team.coach_id.eq.${userId},away_team.coach_id.eq.${userId}`)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createMatch(match: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('matches')
      .insert(match)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMatch(matchId: string, updates: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('matches')
      .update(updates)
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addMatchNote(note: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('match_notes')
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMatchNotes(matchId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('match_notes')
      .select('*')
      .eq('match_id', matchId)
      .order('minute', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Statistics operations
  async getUserStatistics(userId: string): Promise<any> {
    // This would aggregate statistics from matches, players, etc.
    const teams = await this.getUserTeams(userId);
    const players = await this.getUserPlayers(userId);
    const matches = await this.getUserMatches(userId);

    return {
      teams: teams.length,
      players: players.length,
      matches: matches.length,
      wins: matches.filter(m => this.isWin(m, userId)).length,
      draws: matches.filter(m => this.isDraw(m)).length,
      losses: matches.filter(m => this.isLoss(m, userId)).length
    };
  }

  // Chat operations
  async saveChatMessage(message: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getChatHistory(userId: string, limit: number = 50): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Helper methods
  private isWin(match: any, userId: string): boolean {
    // Implement win logic based on match data
    return false; // Placeholder
  }

  private isDraw(match: any): boolean {
    // Implement draw logic based on match data
    return false; // Placeholder
  }

  private isLoss(match: any, userId: string): boolean {
    // Implement loss logic based on match data
    return false; // Placeholder
  }
}