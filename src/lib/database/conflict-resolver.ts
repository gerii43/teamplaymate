import { ConflictResolution, BaseEntity } from './schema';
import { Logger } from '../utils/logger';
import { SYNC_CONFIG } from './config';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

interface ConflictInput {
  entity_type: string;
  entity_id: string;
  local_data: BaseEntity;
  remote_data: BaseEntity | null;
  conflict_type: ConflictResolution['conflict_type'];
}

export class ConflictResolver {
  private logger = new Logger('ConflictResolver');

  async resolve(input: ConflictInput): Promise<ConflictResolution> {
    const resolution: ConflictResolution = {
      id: uuidv4(),
      entity_type: input.entity_type,
      entity_id: input.entity_id,
      conflict_type: input.conflict_type,
      local_data: input.local_data,
      remote_data: input.remote_data || {},
      resolution_strategy: this.determineStrategy(input),
      resolved_data: undefined,
      resolved_at: undefined,
      resolved_by: undefined
    };

    try {
      switch (resolution.resolution_strategy) {
        case 'local':
          resolution.resolved_data = input.local_data;
          break;
        case 'remote':
          resolution.resolved_data = input.remote_data;
          break;
        case 'merge':
          resolution.resolved_data = await this.mergeData(input.local_data, input.remote_data);
          break;
        case 'manual':
          // Store conflict for manual resolution
          await this.storeConflictForManualResolution(resolution);
          return resolution;
      }

      resolution.resolved_at = new Date().toISOString();
      this.logger.info(`Conflict resolved automatically`, {
        entity_type: input.entity_type,
        entity_id: input.entity_id,
        strategy: resolution.resolution_strategy
      });

    } catch (error) {
      this.logger.error('Failed to resolve conflict', error);
      throw error;
    }

    return resolution;
  }

  private determineStrategy(input: ConflictInput): ConflictResolution['resolution_strategy'] {
    const { conflict_type, local_data, remote_data } = input;

    // Use configured strategy
    switch (SYNC_CONFIG.conflictResolutionStrategy) {
      case 'last_write_wins':
        return this.lastWriteWinsStrategy(local_data, remote_data);
      case 'manual':
        return 'manual';
      case 'merge':
        return conflict_type === 'delete' ? 'manual' : 'merge';
      default:
        return 'manual';
    }
  }

  private lastWriteWinsStrategy(
    local_data: BaseEntity, 
    remote_data: BaseEntity | null
  ): ConflictResolution['resolution_strategy'] {
    if (!remote_data) return 'local';
    
    const localTime = new Date(local_data.updated_at).getTime();
    const remoteTime = new Date(remote_data.updated_at).getTime();
    
    return remoteTime > localTime ? 'remote' : 'local';
  }

  private async mergeData(
    local_data: BaseEntity, 
    remote_data: BaseEntity | null
  ): Promise<BaseEntity> {
    if (!remote_data) return local_data;

    const merged = _.cloneDeep(local_data);

    // Merge strategy for different field types
    Object.keys(remote_data).forEach(key => {
      if (key === 'id' || key === 'created_at') {
        // Never merge these fields
        return;
      }

      if (key === 'updated_at') {
        // Use the latest timestamp
        const localTime = new Date(local_data.updated_at).getTime();
        const remoteTime = new Date(remote_data.updated_at).getTime();
        merged[key] = remoteTime > localTime ? remote_data[key] : local_data[key];
        return;
      }

      if (key === 'version') {
        // Use the higher version
        merged[key] = Math.max(local_data.version || 0, remote_data.version || 0) + 1;
        return;
      }

      // For arrays, merge unique values
      if (Array.isArray(remote_data[key]) && Array.isArray(local_data[key])) {
        merged[key] = _.uniqBy([...local_data[key], ...remote_data[key]], 'id');
        return;
      }

      // For objects, deep merge
      if (_.isObject(remote_data[key]) && _.isObject(local_data[key])) {
        merged[key] = _.merge({}, local_data[key], remote_data[key]);
        return;
      }

      // For primitive values, use remote if local is empty/null
      if (!local_data[key] && remote_data[key]) {
        merged[key] = remote_data[key];
        return;
      }

      // For conflicting primitive values, use the one from the latest update
      const localTime = new Date(local_data.updated_at).getTime();
      const remoteTime = new Date(remote_data.updated_at).getTime();
      if (remoteTime > localTime) {
        merged[key] = remote_data[key];
      }
    });

    // Update metadata
    merged.updated_at = new Date().toISOString();
    merged.sync_status = 'synced';
    merged.checksum = this.calculateChecksum(merged);

    return merged;
  }

  private async storeConflictForManualResolution(resolution: ConflictResolution): Promise<void> {
    // In a real implementation, this would store the conflict in a database
    // For now, we'll store it in localStorage for demo purposes
    const conflicts = this.getStoredConflicts();
    conflicts.push(resolution);
    localStorage.setItem('pending_conflicts', JSON.stringify(conflicts));
    
    this.logger.warn('Conflict requires manual resolution', {
      entity_type: resolution.entity_type,
      entity_id: resolution.entity_id
    });
  }

  async getPendingConflicts(): Promise<ConflictResolution[]> {
    return this.getStoredConflicts();
  }

  async resolveManually(
    conflictId: string, 
    strategy: 'local' | 'remote' | 'custom',
    customData?: BaseEntity
  ): Promise<ConflictResolution> {
    const conflicts = this.getStoredConflicts();
    const conflictIndex = conflicts.findIndex(c => c.id === conflictId);
    
    if (conflictIndex === -1) {
      throw new Error(`Conflict not found: ${conflictId}`);
    }

    const conflict = conflicts[conflictIndex];
    
    switch (strategy) {
      case 'local':
        conflict.resolved_data = conflict.local_data;
        break;
      case 'remote':
        conflict.resolved_data = conflict.remote_data;
        break;
      case 'custom':
        if (!customData) {
          throw new Error('Custom data required for custom resolution strategy');
        }
        conflict.resolved_data = customData;
        break;
    }

    conflict.resolution_strategy = strategy === 'custom' ? 'manual' : strategy;
    conflict.resolved_at = new Date().toISOString();

    // Remove from pending conflicts
    conflicts.splice(conflictIndex, 1);
    localStorage.setItem('pending_conflicts', JSON.stringify(conflicts));

    this.logger.info(`Conflict resolved manually`, {
      conflictId,
      strategy,
      entity_type: conflict.entity_type
    });

    return conflict;
  }

  private getStoredConflicts(): ConflictResolution[] {
    try {
      const stored = localStorage.getItem('pending_conflicts');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      this.logger.error('Failed to get stored conflicts', error);
      return [];
    }
  }

  private calculateChecksum(data: any): string {
    // Simple checksum calculation for demo purposes
    // In production, use a proper hashing algorithm
    const str = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  async getConflictStatistics(): Promise<{
    total_conflicts: number;
    auto_resolved: number;
    manual_resolved: number;
    pending: number;
    by_type: Record<string, number>;
    by_strategy: Record<string, number>;
  }> {
    // In a real implementation, this would query the database
    // For demo purposes, we'll return mock statistics
    return {
      total_conflicts: 45,
      auto_resolved: 38,
      manual_resolved: 5,
      pending: 2,
      by_type: {
        version: 25,
        data: 15,
        delete: 5
      },
      by_strategy: {
        last_write_wins: 30,
        merge: 8,
        manual: 7
      }
    };
  }
}