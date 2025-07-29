import { SQLITE_CONFIG, SYNC_CONFIG } from './config';
import { BaseEntity, SyncOperation } from './schema';
import { Logger } from '../utils/logger';
import { EncryptionService } from '../security/encryption';

export class SQLiteManager {
  private db: any = null;
  private logger = new Logger('SQLiteManager');
  private encryption = new EncryptionService();

  async initialize(): Promise<void> {
    try {
      // Initialize SQL.js with proper WebAssembly configuration
      const initSqlJs = await import('sql.js');
      const SQL = await initSqlJs.default({
        locateFile: (file: string) => {
          // Ensure the WebAssembly file is loaded from the correct path
          if (file.endsWith('.wasm')) {
            return `/sql-wasm.wasm`;
          }
          return file;
        }
      });
      
      // Load existing database or create new one
      const dbData = this.loadFromStorage();
      this.db = new SQL.Database(dbData);
      
      await this.createTables();
      this.logger.info('SQLite database initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize SQLite database', error);
      throw error;
    }
  }

  private loadFromStorage(): Uint8Array | undefined {
    try {
      const data = localStorage.getItem(SQLITE_CONFIG.dbName);
      if (data) {
        const decrypted = this.encryption.decrypt(data);
        return new Uint8Array(JSON.parse(decrypted));
      }
    } catch (error) {
      this.logger.warn('Failed to load database from storage', error);
    }
    return undefined;
  }

  private saveToStorage(): void {
    try {
      const data = this.db.export();
      const encrypted = this.encryption.encrypt(JSON.stringify(Array.from(data)));
      localStorage.setItem(SQLITE_CONFIG.dbName, encrypted);
    } catch (error) {
      this.logger.error('Failed to save database to storage', error);
    }
  }

  private async createTables(): Promise<void> {
    const { SQL_SCHEMAS } = await import('./schema');
    
    Object.values(SQL_SCHEMAS.sqlite).forEach(schema => {
      this.db.run(schema);
    });
  }

  async insert<T extends BaseEntity>(table: string, data: T): Promise<string> {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
      this.db.run(query, values);
      
      this.saveToStorage();
      this.logger.debug(`Inserted record into ${table}`, { id: data.id });
      
      return data.id;
    } catch (error) {
      this.logger.error(`Failed to insert into ${table}`, error);
      throw error;
    }
  }

  async update<T extends BaseEntity>(table: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(data), id];

      const query = `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      this.db.run(query, values);
      
      this.saveToStorage();
      this.logger.debug(`Updated record in ${table}`, { id });
    } catch (error) {
      this.logger.error(`Failed to update ${table}`, error);
      throw error;
    }
  }

  async delete(table: string, id: string): Promise<void> {
    try {
      const query = `DELETE FROM ${table} WHERE id = ?`;
      this.db.run(query, [id]);
      
      this.saveToStorage();
      this.logger.debug(`Deleted record from ${table}`, { id });
    } catch (error) {
      this.logger.error(`Failed to delete from ${table}`, error);
      throw error;
    }
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    try {
      const query = `SELECT * FROM ${table} WHERE id = ?`;
      const stmt = this.db.prepare(query);
      const result = stmt.getAsObject([id]);
      
      return result ? this.parseResult<T>(result) : null;
    } catch (error) {
      this.logger.error(`Failed to find by id in ${table}`, error);
      throw error;
    }
  }

  async findAll<T>(table: string, conditions?: Record<string, any>): Promise<T[]> {
    try {
      let query = `SELECT * FROM ${table}`;
      const values: any[] = [];

      if (conditions) {
        const whereClause = Object.keys(conditions)
          .map(key => `${key} = ?`)
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
        values.push(...Object.values(conditions));
      }

      const stmt = this.db.prepare(query);
      const results: T[] = [];
      
      while (stmt.step()) {
        results.push(this.parseResult<T>(stmt.getAsObject()));
      }
      
      return results;
    } catch (error) {
      this.logger.error(`Failed to find all in ${table}`, error);
      throw error;
    }
  }

  async addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'status' | 'retry_count'>): Promise<void> {
    try {
      const syncOp: SyncOperation & BaseEntity = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        retry_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        sync_status: 'pending',
        checksum: '',
        ...operation
      };

      await this.insert('sync_queue', syncOp as any);
      this.logger.debug('Added operation to sync queue', { operation: syncOp.operation, entity_type: syncOp.entity_type });
    } catch (error) {
      this.logger.error('Failed to add to sync queue', error);
      throw error;
    }
  }

  async getPendingSyncOperations(): Promise<SyncOperation[]> {
    return this.findAll<SyncOperation>('sync_queue', { status: 'pending' });
  }

  async updateSyncOperationStatus(id: string, status: SyncOperation['status'], errorMessage?: string): Promise<void> {
    const updateData: any = { status };
    if (errorMessage) {
      updateData.error_message = errorMessage;
    }
    if (status === 'failed') {
      updateData.retry_count = this.db.prepare('SELECT retry_count FROM sync_queue WHERE id = ?').getAsObject([id]).retry_count + 1;
    }

    await this.update('sync_queue', id, updateData);
  }

  async clearCompletedSyncOperations(): Promise<void> {
    try {
      const query = `DELETE FROM sync_queue WHERE status = 'completed' AND timestamp < datetime('now', '-1 day')`;
      this.db.run(query);
      this.saveToStorage();
      this.logger.debug('Cleared completed sync operations');
    } catch (error) {
      this.logger.error('Failed to clear completed sync operations', error);
    }
  }

  async getStorageInfo(): Promise<{ size: number; recordCount: number }> {
    try {
      const data = this.db.export();
      const size = data.length;
      
      const countQuery = `
        SELECT 
          (SELECT COUNT(*) FROM users) +
          (SELECT COUNT(*) FROM teams) +
          (SELECT COUNT(*) FROM players) +
          (SELECT COUNT(*) FROM matches) +
          (SELECT COUNT(*) FROM sync_queue) as total_records
      `;
      
      const result = this.db.prepare(countQuery).getAsObject();
      
      return {
        size,
        recordCount: result.total_records as number
      };
    } catch (error) {
      this.logger.error('Failed to get storage info', error);
      return { size: 0, recordCount: 0 };
    }
  }

  async vacuum(): Promise<void> {
    try {
      this.db.run('VACUUM');
      this.saveToStorage();
      this.logger.info('Database vacuum completed');
    } catch (error) {
      this.logger.error('Failed to vacuum database', error);
    }
  }

  private parseResult<T>(result: any): T {
    const parsed = { ...result };
    
    // Parse JSON fields
    ['team_ids', 'preferences', 'auth_providers', 'statistics', 'attendance', 'medical_info', 'events', 'lineup'].forEach(field => {
      if (parsed[field] && typeof parsed[field] === 'string') {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (error) {
          this.logger.warn(`Failed to parse JSON field ${field}`, error);
        }
      }
    });

    return parsed as T;
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async close(): Promise<void> {
    if (this.db) {
      this.saveToStorage();
      this.db.close();
      this.db = null;
      this.logger.info('SQLite database closed');
    }
  }
}