import { Pool } from 'pg';
import { config } from '../../shared/config';
import { logger } from '../../shared/utils/logger';

export interface UserEntity {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'coach' | 'analyst' | 'player';
  permissions: string[];
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.database.url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO users (
          id, email, password, name, role, permissions, 
          is_active, email_verified, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const values = [
        user.id,
        user.email,
        user.password,
        user.name,
        user.role,
        JSON.stringify(user.permissions),
        user.isActive,
        user.emailVerified,
        user.createdAt,
        user.updatedAt,
      ];

      const result = await client.query(query, values);
      return this.mapRowToUser(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async update(id: string, updateData: Partial<UserEntity>): Promise<UserEntity | null> {
    const client = await this.pool.connect();
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.entries(updateData).forEach(([key, value]) => {
        if (key === 'permissions') {
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
        UPDATE users 
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      const result = await client.query(query, [id]);
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  async findMany(
    page: number,
    limit: number,
    filters: any = {}
  ): Promise<{ users: UserEntity[]; total: number }> {
    const client = await this.pool.connect();
    try {
      const offset = (page - 1) * limit;
      const whereClause = [];
      const values = [];
      let paramIndex = 1;

      // Build where clause based on filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          whereClause.push(`${this.camelToSnake(key)} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM users ${whereString}`;
      const countResult = await client.query(countQuery, values);
      const total = parseInt(countResult.rows[0].count);

      // Get users
      const usersQuery = `
        SELECT * FROM users 
        ${whereString}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const usersResult = await client.query(usersQuery, [...values, limit, offset]);
      const users = usersResult.rows.map(row => this.mapRowToUser(row));

      return { users, total };
    } finally {
      client.release();
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = 'UPDATE users SET last_login_at = NOW() WHERE id = $1';
      await client.query(query, [id]);
    } finally {
      client.release();
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = 'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2';
      await client.query(query, [hashedPassword, id]);
    } finally {
      client.release();
    }
  }

  private mapRowToUser(row: any): UserEntity {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      role: row.role,
      permissions: JSON.parse(row.permissions || '[]'),
      isActive: row.is_active,
      emailVerified: row.email_verified,
      lastLoginAt: row.last_login_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}