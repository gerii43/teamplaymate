import { SQLiteManager } from './sqlite-manager';
import { SyncManager } from './sync-manager';
import { CacheManager } from './cache-manager';
import { ConflictResolver } from './conflict-resolver';
import { PerformanceMonitor } from '../utils/performance-monitor';
import { Logger } from '../utils/logger';
import { BaseEntity, User, Team, Player, Match } from './schema';
import { supabase, firestore } from './config';

export class DatabaseManager {
  private sqliteManager: SQLiteManager;
  private syncManager: SyncManager;
  private cacheManager: CacheManager;
  private conflictResolver: ConflictResolver;
  private performanceMonitor: PerformanceMonitor;
  private logger = new Logger('DatabaseManager');
  private isInitialized = false;

  constructor() {
    this.sqliteManager = new SQLiteManager();
    this.syncManager = new SyncManager(this.sqliteManager);
    this.cacheManager = new CacheManager();
    this.conflictResolver = new ConflictResolver();
    this.performanceMonitor = new PerformanceMonitor();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Database manager already initialized');
      return;
    }

    try {
      this.logger.info('Initializing database manager...');

      // Initialize SQLite for offline storage
      await this.sqliteManager.initialize();

      // Initialize sync manager for real-time synchronization
      await this.syncManager.initialize();

      // Test database connections
      await this.testConnections();

      this.isInitialized = true;
      this.logger.info('Database manager initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize database manager', error);
      throw error;
    }
  }

  private async testConnections(): Promise<void> {
    const connectionTests = [
      this.testSupabaseConnection(),
      this.testFirebaseConnection()
    ];

    const results = await Promise.allSettled(connectionTests);
    
    results.forEach((result, index) => {
      const dbNames = ['Supabase', 'Firebase'];
      if (result.status === 'fulfilled') {
        this.logger.info(`${dbNames[index]} connection successful`);
      } else {
        this.logger.error(`${dbNames[index]} connection failed`, result.reason);
      }
    });
  }

  private async testSupabaseConnection(): Promise<void> {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
  }

  private async testFirebaseConnection(): Promise<void> {
    try {
      // Simple test to verify Firebase connection using admin SDK methods
      const testQuery = await (firestore as any).collection('_test').limit(1).get();
      // Connection successful if no error thrown
    } catch (error) {
      throw new Error('Firebase connection test failed');
    }
  }

  // CRUD Operations with caching and offline support
  async create<T extends BaseEntity>(table: string, data: Omit<T, keyof BaseEntity>): Promise<T> {
    return this.performanceMonitor.measureAsync(`create_${table}`, async () => {
      try {
        const entity: T = {
          ...data,
          id: this.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          sync_status: 'pending',
          checksum: this.calculateChecksum(data)
        } as T;

        // Store locally first
        await this.sqliteManager.insert(table, entity);

        // Add to sync queue
        await this.sqliteManager.addToSyncQueue({
          entity_type: table,
          entity_id: entity.id,
          operation: 'create',
          data: entity,
          target_databases: ['supabase', 'firebase']
        });

        // Cache the entity
        this.cacheManager.set(`${table}:${entity.id}`, entity);

        this.logger.info(`Created ${table} entity`, { id: entity.id });
        return entity;
      } catch (error) {
        this.logger.error(`Failed to create ${table} entity`, error);
        throw error;
      }
    });
  }

  async findById<T extends BaseEntity>(table: string, id: string): Promise<T | null> {
    return this.performanceMonitor.measureAsync(`findById_${table}`, async () => {
      try {
        // Check cache first
        const cacheKey = `${table}:${id}`;
        const cached = this.cacheManager.get<T>(cacheKey);
        if (cached) {
          this.logger.debug(`Cache hit for ${table}:${id}`);
          return cached;
        }

        // Check local SQLite database
        const local = await this.sqliteManager.findById<T>(table, id);
        if (local) {
          this.cacheManager.set(cacheKey, local);
          return local;
        }

        // If not found locally and online, try remote databases
        if (navigator.onLine) {
          const remote = await this.fetchFromRemote<T>(table, id);
          if (remote) {
            // Store locally and cache
            await this.sqliteManager.insert(table, remote);
            this.cacheManager.set(cacheKey, remote);
            return remote;
          }
        }

        return null;
      } catch (error) {
        this.logger.error(`Failed to find ${table} by id: ${id}`, error);
        throw error;
      }
    });
  }

  async findAll<T extends BaseEntity>(table: string, conditions?: Record<string, any>): Promise<T[]> {
    return this.performanceMonitor.measureAsync(`findAll_${table}`, async () => {
      try {
        // For now, return from local SQLite
        // In production, implement intelligent caching and remote fetching
        const results = await this.sqliteManager.findAll<T>(table, conditions);
        
        this.logger.debug(`Found ${results.length} ${table} entities`, { conditions });
        return results;
      } catch (error) {
        this.logger.error(`Failed to find all ${table} entities`, error);
        throw error;
      }
    });
  }

  async update<T extends BaseEntity>(table: string, id: string, data: Partial<T>): Promise<T> {
    return this.performanceMonitor.measureAsync(`update_${table}`, async () => {
      try {
        const existing = await this.findById<T>(table, id);
        if (!existing) {
          throw new Error(`Entity not found: ${table}:${id}`);
        }

        const updated: T = {
          ...existing,
          ...data,
          updated_at: new Date().toISOString(),
          version: existing.version + 1,
          sync_status: 'pending',
          checksum: this.calculateChecksum({ ...existing, ...data })
        } as T;

        // Update locally
        await this.sqliteManager.update(table, id, updated);

        // Add to sync queue
        await this.sqliteManager.addToSyncQueue({
          entity_type: table,
          entity_id: id,
          operation: 'update',
          data: updated,
          target_databases: ['supabase', 'firebase']
        });

        // Update cache
        this.cacheManager.set(`${table}:${id}`, updated);

        this.logger.info(`Updated ${table} entity`, { id });
        return updated;
      } catch (error) {
        this.logger.error(`Failed to update ${table} entity: ${id}`, error);
        throw error;
      }
    });
  }

  async delete(table: string, id: string): Promise<void> {
    return this.performanceMonitor.measureAsync(`delete_${table}`, async () => {
      try {
        const existing = await this.findById(table, id);
        if (!existing) {
          throw new Error(`Entity not found: ${table}:${id}`);
        }

        // Delete locally
        await this.sqliteManager.delete(table, id);

        // Add to sync queue
        await this.sqliteManager.addToSyncQueue({
          entity_type: table,
          entity_id: id,
          operation: 'delete',
          data: existing,
          target_databases: ['supabase', 'firebase']
        });

        // Remove from cache
        this.cacheManager.delete(`${table}:${id}`);

        this.logger.info(`Deleted ${table} entity`, { id });
      } catch (error) {
        this.logger.error(`Failed to delete ${table} entity: ${id}`, error);
        throw error;
      }
    });
  }

  // Specialized methods for different entity types
  async createUser(userData: Omit<User, keyof BaseEntity>): Promise<User> {
    return this.create<User>('users', userData);
  }

  async createTeam(teamData: Omit<Team, keyof BaseEntity>): Promise<Team> {
    return this.create<Team>('teams', teamData);
  }

  async createPlayer(playerData: Omit<Player, keyof BaseEntity>): Promise<Player> {
    return this.create<Player>('players', playerData);
  }

  async createMatch(matchData: Omit<Match, keyof BaseEntity>): Promise<Match> {
    return this.create<Match>('matches', matchData);
  }

  // Sync operations
  async forcSync(): Promise<void> {
    await this.syncManager.syncToRemote();
  }

  async getSyncStatus(): Promise<any> {
    return this.syncManager.getQueueStatus();
  }

  async retryFailedSync(): Promise<void> {
    await this.syncManager.retryFailedOperations();
  }

  // Conflict resolution
  async getPendingConflicts(): Promise<any[]> {
    return this.conflictResolver.getPendingConflicts();
  }

  async resolveConflict(conflictId: string, strategy: 'local' | 'remote' | 'custom', customData?: any): Promise<any> {
    return this.conflictResolver.resolveManually(conflictId, strategy, customData);
  }

  // Performance and monitoring
  getPerformanceMetrics(): any {
    return this.performanceMonitor.getPerformanceReport();
  }

  getCacheStats(): any {
    return this.cacheManager.getStats();
  }

  async getStorageInfo(): Promise<any> {
    return this.sqliteManager.getStorageInfo();
  }

  // Maintenance operations
  async vacuum(): Promise<void> {
    await this.sqliteManager.vacuum();
  }

  async clearCache(): Promise<void> {
    this.cacheManager.clear();
  }

  async exportData(): Promise<string> {
    // Export all data for backup purposes
    const tables = ['users', 'teams', 'players', 'matches'];
    const exportData: Record<string, any[]> = {};

    for (const table of tables) {
      exportData[table] = await this.sqliteManager.findAll(table);
    }

    return JSON.stringify({
      timestamp: new Date().toISOString(),
      data: exportData,
      metadata: {
        version: '1.0',
        total_records: Object.values(exportData).reduce((sum, records) => sum + records.length, 0)
      }
    }, null, 2);
  }

  // Private helper methods
  private async fetchFromRemote<T>(table: string, id: string): Promise<T | null> {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as T;
      }

      // Fallback to Firebase
      const doc = await (firestore as any).collection(table).doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as T;
      }

      return null;
    } catch (error) {
      this.logger.error(`Failed to fetch from remote: ${table}:${id}`, error);
      return null;
    }
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private calculateChecksum(data: any): string {
    const str = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  async destroy(): Promise<void> {
    this.syncManager.destroy();
    this.cacheManager.destroy();
    await this.sqliteManager.close();
    this.logger.info('Database manager destroyed');
  }
}