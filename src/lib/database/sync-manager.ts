import { supabase, firestore } from './config';
import { SQLiteManager } from './sqlite-manager';
import { ConflictResolver } from './conflict-resolver';
import { Logger } from '../utils/logger';
import { PerformanceMonitor } from '../utils/performance-monitor';
import { BaseEntity, SyncOperation, ConflictResolution } from './schema';
import { doc, setDoc, getDoc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export class SyncManager {
  private sqliteManager: SQLiteManager;
  private conflictResolver: ConflictResolver;
  private logger = new Logger('SyncManager');
  private performanceMonitor = new PerformanceMonitor();
  private syncInProgress = false;
  private realtimeSubscriptions: Map<string, () => void> = new Map();

  constructor(sqliteManager: SQLiteManager) {
    this.sqliteManager = sqliteManager;
    this.conflictResolver = new ConflictResolver();
  }

  async initialize(): Promise<void> {
    try {
      await this.setupRealtimeSync();
      this.startPeriodicSync();
      this.logger.info('Sync manager initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize sync manager', error);
      throw error;
    }
  }

  private async setupRealtimeSync(): Promise<void> {
    // Setup Supabase real-time subscriptions
    const tables = ['users', 'teams', 'players', 'matches'];
    
    tables.forEach(table => {
      const subscription = supabase
        .channel(`public:${table}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table },
          (payload) => this.handleRealtimeChange(table, payload)
        )
        .subscribe();

      this.realtimeSubscriptions.set(`supabase_${table}`, () => subscription.unsubscribe());
    });

    // Setup Firebase real-time listeners
    tables.forEach(table => {
      const q = query(
        collection(firestore, table),
        orderBy('updated_at', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          this.handleFirebaseChange(table, change);
        });
      });

      this.realtimeSubscriptions.set(`firebase_${table}`, unsubscribe);
    });
  }

  private async handleRealtimeChange(table: string, payload: any): Promise<void> {
    try {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      this.logger.debug(`Received real-time change from Supabase`, { 
        table, 
        eventType, 
        recordId: newRecord?.id || oldRecord?.id 
      });

      switch (eventType) {
        case 'INSERT':
          await this.handleRemoteInsert(table, newRecord);
          break;
        case 'UPDATE':
          await this.handleRemoteUpdate(table, newRecord, oldRecord);
          break;
        case 'DELETE':
          await this.handleRemoteDelete(table, oldRecord);
          break;
      }
    } catch (error) {
      this.logger.error('Failed to handle real-time change', error);
    }
  }

  private async handleFirebaseChange(table: string, change: any): Promise<void> {
    try {
      const { type, doc } = change;
      const data = { id: doc.id, ...doc.data() };

      this.logger.debug(`Received real-time change from Firebase`, { 
        table, 
        type, 
        recordId: data.id 
      });

      switch (type) {
        case 'added':
          await this.handleRemoteInsert(table, data);
          break;
        case 'modified':
          await this.handleRemoteUpdate(table, data);
          break;
        case 'removed':
          await this.handleRemoteDelete(table, data);
          break;
      }
    } catch (error) {
      this.logger.error('Failed to handle Firebase change', error);
    }
  }

  private async handleRemoteInsert(table: string, record: BaseEntity): Promise<void> {
    const localRecord = await this.sqliteManager.findById(table, record.id);
    
    if (!localRecord) {
      // New record, insert locally
      await this.sqliteManager.insert(table, record);
    } else {
      // Conflict: record exists locally
      await this.resolveConflict(table, record.id, localRecord as BaseEntity, record, 'data');
    }
  }

  private async handleRemoteUpdate(table: string, record: BaseEntity, oldRecord?: BaseEntity): Promise<void> {
    const localRecord = await this.sqliteManager.findById(table, record.id);
    
    if (!localRecord) {
      // Record doesn't exist locally, insert it
      await this.sqliteManager.insert(table, record);
    } else {
      // Check for version conflicts  
      if ((localRecord as any).version !== record.version - 1) {
        await this.resolveConflict(table, record.id, localRecord as BaseEntity, record, 'version');
      } else {
        // No conflict, update locally
        await this.sqliteManager.update(table, record.id, record);
      }
    }
  }

  private async handleRemoteDelete(table: string, record: BaseEntity): Promise<void> {
    const localRecord = await this.sqliteManager.findById(table, record.id);
    
    if (localRecord) {
      if ((localRecord as any).sync_status === 'pending') {
        // Conflict: local changes pending
        await this.resolveConflict(table, record.id, localRecord as BaseEntity, null, 'delete');
      } else {
        // No conflict, delete locally
        await this.sqliteManager.delete(table, record.id);
      }
    }
  }

  async syncToRemote(): Promise<void> {
    if (this.syncInProgress) {
      this.logger.warn('Sync already in progress, skipping');
      return;
    }

    this.syncInProgress = true;
    const startTime = Date.now();

    try {
      const pendingOperations = await this.sqliteManager.getPendingSyncOperations();
      this.logger.info(`Starting sync of ${pendingOperations.length} operations`);

      for (const operation of pendingOperations) {
        await this.processSyncOperation(operation);
      }

      await this.sqliteManager.clearCompletedSyncOperations();
      
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordSyncDuration(duration);
      this.logger.info(`Sync completed in ${duration}ms`);
    } catch (error) {
      this.logger.error('Sync failed', error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processSyncOperation(operation: SyncOperation): Promise<void> {
    try {
      await this.sqliteManager.updateSyncOperationStatus(operation.id, 'processing');

      const promises = operation.target_databases.map(async (database) => {
        switch (database) {
          case 'supabase':
            return this.syncToSupabase(operation);
          case 'firebase':
            return this.syncToFirebase(operation);
          default:
            throw new Error(`Unknown database: ${database}`);
        }
      });

      await Promise.all(promises);
      await this.sqliteManager.updateSyncOperationStatus(operation.id, 'completed');
      
      this.logger.debug(`Sync operation completed`, { 
        operation: operation.operation, 
        entity_type: operation.entity_type,
        entity_id: operation.entity_id 
      });
    } catch (error) {
      await this.sqliteManager.updateSyncOperationStatus(
        operation.id, 
        'failed', 
        error.message
      );
      
      this.logger.error(`Sync operation failed`, error);
      throw error;
    }
  }

  private async syncToSupabase(operation: SyncOperation): Promise<void> {
    const { entity_type, entity_id, operation: op, data } = operation;

    switch (op) {
      case 'create':
        const { error: insertError } = await supabase
          .from(entity_type)
          .insert(data);
        if (insertError) throw insertError;
        break;

      case 'update':
        const { error: updateError } = await supabase
          .from(entity_type)
          .update(data)
          .eq('id', entity_id);
        if (updateError) throw updateError;
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from(entity_type)
          .delete()
          .eq('id', entity_id);
        if (deleteError) throw deleteError;
        break;
    }
  }

  private async syncToFirebase(operation: SyncOperation): Promise<void> {
    const { entity_type, entity_id, operation: op, data } = operation;
    const docRef = doc(firestore, entity_type, entity_id);

    switch (op) {
      case 'create':
      case 'update':
        await setDoc(docRef, data, { merge: true });
        break;

      case 'delete':
        await setDoc(docRef, { deleted: true, deleted_at: new Date().toISOString() });
        break;
    }
  }

  private async resolveConflict(
    table: string, 
    entityId: string, 
    localData: BaseEntity, 
    remoteData: BaseEntity | null, 
    conflictType: ConflictResolution['conflict_type']
  ): Promise<void> {
    const resolution = await this.conflictResolver.resolve({
      entity_type: table,
      entity_id: entityId,
      local_data: localData,
      remote_data: remoteData,
      conflict_type: conflictType
    });

    if (resolution.resolved_data) {
      await this.sqliteManager.update(table, entityId, resolution.resolved_data);
    }
  }

  private startPeriodicSync(): void {
    setInterval(async () => {
      try {
        await this.syncToRemote();
      } catch (error) {
        this.logger.error('Periodic sync failed', error);
      }
    }, 30000); // Sync every 30 seconds
  }

  async getQueueStatus(): Promise<{
    pending: number;
    processing: number;
    failed: number;
    completed_today: number;
  }> {
    const allOperations = await this.sqliteManager.findAll<SyncOperation>('sync_queue');
    const today = new Date().toISOString().split('T')[0];

    return {
      pending: allOperations.filter(op => op.status === 'pending').length,
      processing: allOperations.filter(op => op.status === 'processing').length,
      failed: allOperations.filter(op => op.status === 'failed').length,
      completed_today: allOperations.filter(op => 
        op.status === 'completed' && op.timestamp.startsWith(today)
      ).length
    };
  }

  async retryFailedOperations(): Promise<void> {
    const failedOperations = await this.sqliteManager.findAll<SyncOperation>('sync_queue', { 
      status: 'failed' 
    });

    for (const operation of failedOperations) {
      if (operation.retry_count < 3) {
        await this.sqliteManager.updateSyncOperationStatus(operation.id, 'pending');
      }
    }

    this.logger.info(`Retrying ${failedOperations.length} failed operations`);
  }

  destroy(): void {
    // Unsubscribe from all real-time subscriptions
    this.realtimeSubscriptions.forEach(unsubscribe => unsubscribe());
    this.realtimeSubscriptions.clear();
    
    this.logger.info('Sync manager destroyed');
  }
}