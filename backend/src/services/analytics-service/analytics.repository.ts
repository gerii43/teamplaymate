import { Pool } from 'pg';
import { config } from '../../shared/config';
import { logger } from '../../shared/utils/logger';
import { AnalyticsReport } from './analytics.service';

export class AnalyticsRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.database.url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async create(report: AnalyticsReport): Promise<AnalyticsReport> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO analytics_reports (
          id, type, entity_type, entity_id, data, metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [
        report.id,
        report.type,
        report.entityType,
        report.entityId,
        JSON.stringify(report.data),
        JSON.stringify(report.metadata),
        report.createdAt
      ];

      const result = await client.query(query, values);
      return this.mapRowToReport(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<AnalyticsReport | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM analytics_reports WHERE id = $1';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToReport(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async findMany(filters: any = {}): Promise<AnalyticsReport[]> {
    const client = await this.pool.connect();
    try {
      let query = 'SELECT * FROM analytics_reports';
      const values: any[] = [];
      const whereClause: string[] = [];
      let paramIndex = 1;

      // Build where clause based on filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          whereClause.push(`${this.camelToSnake(key)} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      if (whereClause.length > 0) {
        query += ` WHERE ${whereClause.join(' AND ')}`;
      }

      query += ' ORDER BY created_at DESC';

      const result = await client.query(query, values);
      return result.rows.map(row => this.mapRowToReport(row));
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = 'DELETE FROM analytics_reports WHERE id = $1';
      const result = await client.query(query, [id]);
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  private mapRowToReport(row: any): AnalyticsReport {
    return {
      id: row.id,
      type: row.type,
      entityType: row.entity_type,
      entityId: row.entity_id,
      data: JSON.parse(row.data),
      metadata: JSON.parse(row.metadata),
      createdAt: row.created_at
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}