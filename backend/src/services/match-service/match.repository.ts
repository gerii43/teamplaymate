import { Pool } from 'pg';
import { config } from '../../shared/config';
import { logger } from '../../shared/utils/logger';
import { Match } from './match.service';

export class MatchRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.database.url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async create(match: Match): Promise<Match> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO matches (
          id, home_team_id, away_team_id, date, venue, status, score, 
          events, statistics, notes, sport, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;
      
      const values = [
        match.id,
        match.homeTeamId,
        match.awayTeamId,
        match.date,
        match.venue,
        match.status,
        JSON.stringify(match.score),
        JSON.stringify(match.events),
        JSON.stringify(match.statistics),
        JSON.stringify(match.notes),
        match.sport,
        match.createdAt,
        match.updatedAt
      ];

      const result = await client.query(query, values);
      return this.mapRowToMatch(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<Match | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM matches WHERE id = $1';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToMatch(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async findMany(
    page: number,
    limit: number,
    filters: any = {}
  ): Promise<{ matches: Match[]; total: number }> {
    const client = await this.pool.connect();
    try {
      const offset = (page - 1) * limit;
      const whereClause = [];
      const values = [];
      let paramIndex = 1;

      // Build where clause based on filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'page' && key !== 'limit') {
          whereClause.push(`${this.camelToSnake(key)} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM matches ${whereString}`;
      const countResult = await client.query(countQuery, values);
      const total = parseInt(countResult.rows[0].count);

      // Get matches
      const matchesQuery = `
        SELECT * FROM matches 
        ${whereString}
        ORDER BY date DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const matchesResult = await client.query(matchesQuery, [...values, limit, offset]);
      const matches = matchesResult.rows.map(row => this.mapRowToMatch(row));

      return { matches, total };
    } finally {
      client.release();
    }
  }

  async update(id: string, updateData: Partial<Match>): Promise<Match | null> {
    const client = await this.pool.connect();
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.entries(updateData).forEach(([key, value]) => {
        if (key === 'score' || key === 'events' || key === 'statistics' || key === 'notes') {
          setClause.push(`${this.camelToSnake(key)} = $${paramIndex}`);
          values.push(JSON.stringify(value));
        } else {
          setClause.push(`${this.camelToSnake(key)} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      });

      values.push(id);

      const query = `
        UPDATE matches 
        SET ${setClause.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToMatch(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = 'DELETE FROM matches WHERE id = $1';
      const result = await client.query(query, [id]);
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  private mapRowToMatch(row: any): Match {
    return {
      id: row.id,
      homeTeamId: row.home_team_id,
      awayTeamId: row.away_team_id,
      date: row.date,
      venue: row.venue,
      status: row.status,
      score: JSON.parse(row.score || '{"home": 0, "away": 0}'),
      events: JSON.parse(row.events || '[]'),
      statistics: JSON.parse(row.statistics || '{}'),
      notes: JSON.parse(row.notes || '[]'),
      sport: row.sport,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}