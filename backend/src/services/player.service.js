const { supabase } = require('../config/supabase.js');

class PlayerService {
  constructor() {
    this.table = 'players';
  }

  async getPlayers(userId, options = {}) {
    try {
      const { page = 1, limit = 20, teamId, position, search } = options;
      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.table)
        .select(`
          *,
          teams!inner(id, name, user_id)
        `)
        .eq('teams.user_id', userId);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      if (position) {
        query = query.eq('position', position);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('name', { ascending: true });

      if (error) throw error;

      return {
        players: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }

  async getPlayerById(playerId, userId) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select(`
          *,
          teams!inner(id, name, user_id)
        `)
        .eq('id', playerId)
        .eq('teams.user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching player:', error);
      throw error;
    }
  }

  async createPlayer(playerData) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .insert(playerData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  }

  async updatePlayer(playerId, userId, updateData) {
    try {
      // First verify the player belongs to the user
      const player = await this.getPlayerById(playerId, userId);
      if (!player) {
        return null;
      }

      const { data, error } = await supabase
        .from(this.table)
        .update(updateData)
        .eq('id', playerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  }

  async deletePlayer(playerId, userId) {
    try {
      // First verify the player belongs to the user
      const player = await this.getPlayerById(playerId, userId);
      if (!player) {
        return false;
      }

      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', playerId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  }

  async getPlayerStats(playerId, userId, options = {}) {
    try {
      const { period = 'all', teamId } = options;

      // Verify player belongs to user
      const player = await this.getPlayerById(playerId, userId);
      if (!player) {
        return null;
      }

      // Get match events for the player
      let query = supabase
        .from('match_events')
        .select('*')
        .eq('player_id', playerId);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      if (period !== 'all') {
        const startDate = this.getStartDateForPeriod(period);
        query = query.gte('created_at', startDate);
      }

      const { data: events, error } = await query;

      if (error) throw error;

      // Calculate statistics
      const stats = this.calculatePlayerStats(events || []);

      return {
        playerId,
        period,
        stats,
        totalEvents: events?.length || 0
      };
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  }

  async updatePlayerPhoto(playerId, userId, photoUrl) {
    try {
      return await this.updatePlayer(playerId, userId, { photo_url: photoUrl });
    } catch (error) {
      console.error('Error updating player photo:', error);
      throw error;
    }
  }

  async getPlayersByTeam(teamId, userId, options = {}) {
    try {
      const { position, active } = options;

      let query = supabase
        .from(this.table)
        .select(`
          *,
          teams!inner(id, name, user_id)
        `)
        .eq('team_id', teamId)
        .eq('teams.user_id', userId);

      if (position) {
        query = query.eq('position', position);
      }

      if (active !== undefined) {
        query = query.eq('active', active);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching team players:', error);
      throw error;
    }
  }

  async bulkCreatePlayers(players, teamId, userId) {
    try {
      // Verify team belongs to user
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('id', teamId)
        .eq('user_id', userId)
        .single();

      if (teamError || !team) {
        throw new Error('Team not found or access denied');
      }

      // Add team_id to each player
      const playersWithTeam = players.map(player => ({
        ...player,
        team_id: teamId
      }));

      const { data, error } = await supabase
        .from(this.table)
        .insert(playersWithTeam)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error bulk creating players:', error);
      throw error;
    }
  }

  async searchPlayers(searchTerm, userId, options = {}) {
    try {
      const { teamId, position, limit = 10 } = options;

      let query = supabase
        .from(this.table)
        .select(`
          *,
          teams!inner(id, name, user_id)
        `)
        .eq('teams.user_id', userId)
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(limit);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      if (position) {
        query = query.eq('position', position);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  }

  calculatePlayerStats(events) {
    const stats = {
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      matches: 0,
      minutes: 0,
      shots: 0,
      shotsOnTarget: 0,
      passes: 0,
      passesCompleted: 0,
      tackles: 0,
      tacklesWon: 0,
      fouls: 0,
      foulsSuffered: 0
    };

    const matchIds = new Set();

    events.forEach(event => {
      matchIds.add(event.match_id);

      switch (event.event_type) {
        case 'goal':
          stats.goals++;
          break;
        case 'assist':
          stats.assists++;
          break;
        case 'yellow_card':
          stats.yellowCards++;
          break;
        case 'red_card':
          stats.redCards++;
          break;
        case 'shot':
          stats.shots++;
          if (event.result === 'on_target') {
            stats.shotsOnTarget++;
          }
          break;
        case 'pass':
          stats.passes++;
          if (event.result === 'completed') {
            stats.passesCompleted++;
          }
          break;
        case 'tackle':
          stats.tackles++;
          if (event.result === 'won') {
            stats.tacklesWon++;
          }
          break;
        case 'foul':
          stats.fouls++;
          break;
        case 'foul_suffered':
          stats.foulsSuffered++;
          break;
      }

      if (event.minutes) {
        stats.minutes += event.minutes;
      }
    });

    stats.matches = matchIds.size;
    stats.passAccuracy = stats.passes > 0 ? (stats.passesCompleted / stats.passes * 100).toFixed(1) : 0;
    stats.shotAccuracy = stats.shots > 0 ? (stats.shotsOnTarget / stats.shots * 100).toFixed(1) : 0;
    stats.tackleSuccess = stats.tackles > 0 ? (stats.tacklesWon / stats.tackles * 100).toFixed(1) : 0;

    return stats;
  }

  getStartDateForPeriod(period) {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return weekAgo.toISOString();
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), quarter * 3, 1).toISOString();
      case 'year':
        return new Date(now.getFullYear(), 0, 1).toISOString();
      default:
        return new Date(0).toISOString();
    }
  }
}

module.exports = PlayerService; 