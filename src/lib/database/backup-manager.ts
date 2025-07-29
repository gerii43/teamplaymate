import { DatabaseManager } from './database-manager';
import { Logger } from '../utils/logger';
import { EncryptionService } from '../security/encryption';
import { supabase } from './config';

interface BackupMetadata {
  id: string;
  timestamp: string;
  size: number;
  checksum: string;
  tables: string[];
  record_count: number;
  version: string;
  encrypted: boolean;
}

interface BackupConfig {
  autoBackup: boolean;
  backupInterval: number; // in milliseconds
  maxBackups: number;
  encryptBackups: boolean;
  compressionEnabled: boolean;
}

export class BackupManager {
  private logger = new Logger('BackupManager');
  private encryption = new EncryptionService();
  private config: BackupConfig;
  private backupTimer?: NodeJS.Timeout;

  constructor(
    private databaseManager: DatabaseManager,
    config: Partial<BackupConfig> = {}
  ) {
    this.config = {
      autoBackup: true,
      backupInterval: 24 * 60 * 60 * 1000, // 24 hours
      maxBackups: 7, // Keep 7 days of backups
      encryptBackups: true,
      compressionEnabled: true,
      ...config
    };

    if (this.config.autoBackup) {
      this.startAutoBackup();
    }
  }

  async createBackup(description?: string): Promise<BackupMetadata> {
    try {
      this.logger.info('Starting backup creation...');
      const startTime = Date.now();

      // Export all data
      const exportData = await this.databaseManager.exportData();
      const parsedData = JSON.parse(exportData);

      // Create backup metadata
      const metadata: BackupMetadata = {
        id: this.generateBackupId(),
        timestamp: new Date().toISOString(),
        size: exportData.length,
        checksum: this.calculateChecksum(exportData),
        tables: Object.keys(parsedData.data),
        record_count: parsedData.metadata.total_records,
        version: '1.0',
        encrypted: this.config.encryptBackups
      };

      // Process backup data
      let backupData = exportData;
      
      if (this.config.compressionEnabled) {
        backupData = await this.compressData(backupData);
        this.logger.debug('Backup data compressed');
      }

      if (this.config.encryptBackups) {
        backupData = this.encryption.encrypt(backupData);
        this.logger.debug('Backup data encrypted');
      }

      // Store backup
      await this.storeBackup(metadata, backupData, description);

      // Cleanup old backups
      await this.cleanupOldBackups();

      const duration = Date.now() - startTime;
      this.logger.info(`Backup created successfully in ${duration}ms`, {
        id: metadata.id,
        size: metadata.size,
        records: metadata.record_count
      });

      return metadata;
    } catch (error) {
      this.logger.error('Failed to create backup', error);
      throw error;
    }
  }

  async restoreBackup(backupId: string): Promise<void> {
    try {
      this.logger.info(`Starting backup restoration: ${backupId}`);
      const startTime = Date.now();

      // Retrieve backup
      const { metadata, data } = await this.retrieveBackup(backupId);
      
      // Verify backup integrity
      if (!this.verifyBackupIntegrity(data, metadata)) {
        throw new Error('Backup integrity check failed');
      }

      // Process backup data
      let backupData = data;
      
      if (metadata.encrypted) {
        backupData = this.encryption.decrypt(backupData);
        this.logger.debug('Backup data decrypted');
      }

      if (this.config.compressionEnabled) {
        backupData = await this.decompressData(backupData);
        this.logger.debug('Backup data decompressed');
      }

      // Parse and restore data
      const parsedData = JSON.parse(backupData);
      await this.restoreData(parsedData.data);

      const duration = Date.now() - startTime;
      this.logger.info(`Backup restored successfully in ${duration}ms`, {
        id: backupId,
        records: metadata.record_count
      });
    } catch (error) {
      this.logger.error(`Failed to restore backup: ${backupId}`, error);
      throw error;
    }
  }

  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('backups')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      this.logger.error('Failed to list backups', error);
      throw error;
    }
  }

  async deleteBackup(backupId: string): Promise<void> {
    try {
      // Delete backup data from storage
      const { error: storageError } = await supabase.storage
        .from('backups')
        .remove([`${backupId}.backup`]);

      if (storageError) throw storageError;

      // Delete backup metadata
      const { error: dbError } = await supabase
        .from('backups')
        .delete()
        .eq('id', backupId);

      if (dbError) throw dbError;

      this.logger.info(`Backup deleted: ${backupId}`);
    } catch (error) {
      this.logger.error(`Failed to delete backup: ${backupId}`, error);
      throw error;
    }
  }

  async validateBackup(backupId: string): Promise<{
    valid: boolean;
    issues: string[];
    metadata: BackupMetadata;
  }> {
    try {
      const { metadata, data } = await this.retrieveBackup(backupId);
      const issues: string[] = [];

      // Check integrity
      if (!this.verifyBackupIntegrity(data, metadata)) {
        issues.push('Backup integrity check failed');
      }

      // Check if backup can be decrypted/decompressed
      try {
        let processedData = data;
        
        if (metadata.encrypted) {
          processedData = this.encryption.decrypt(processedData);
        }
        
        if (this.config.compressionEnabled) {
          processedData = await this.decompressData(processedData);
        }

        // Try to parse the data
        JSON.parse(processedData);
      } catch (error) {
        issues.push('Failed to process backup data');
      }

      return {
        valid: issues.length === 0,
        issues,
        metadata
      };
    } catch (error) {
      this.logger.error(`Failed to validate backup: ${backupId}`, error);
      return {
        valid: false,
        issues: ['Failed to retrieve backup'],
        metadata: {} as BackupMetadata
      };
    }
  }

  private async storeBackup(metadata: BackupMetadata, data: string, description?: string): Promise<void> {
    // Store backup data in Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('backups')
      .upload(`${metadata.id}.backup`, data, {
        contentType: 'application/octet-stream'
      });

    if (storageError) throw storageError;

    // Store backup metadata in database
    const { error: dbError } = await supabase
      .from('backups')
      .insert({
        ...metadata,
        description: description || `Automatic backup - ${metadata.timestamp}`
      });

    if (dbError) throw dbError;
  }

  private async retrieveBackup(backupId: string): Promise<{ metadata: BackupMetadata; data: string }> {
    // Get backup metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('backups')
      .select('*')
      .eq('id', backupId)
      .single();

    if (metadataError) throw metadataError;

    // Get backup data
    const { data, error: storageError } = await supabase.storage
      .from('backups')
      .download(`${backupId}.backup`);

    if (storageError) throw storageError;

    const backupData = await data.text();

    return { metadata, data: backupData };
  }

  private async restoreData(data: Record<string, any[]>): Promise<void> {
    // Clear existing data (in production, you might want to be more careful)
    // This is a simplified implementation
    
    for (const [table, records] of Object.entries(data)) {
      this.logger.info(`Restoring ${records.length} records to ${table}`);
      
      for (const record of records) {
        try {
          await this.databaseManager.create(table, record);
        } catch (error) {
          this.logger.warn(`Failed to restore record in ${table}`, { record, error });
        }
      }
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const backups = await this.listBackups();
      
      if (backups.length > this.config.maxBackups) {
        const backupsToDelete = backups.slice(this.config.maxBackups);
        
        for (const backup of backupsToDelete) {
          await this.deleteBackup(backup.id);
        }
        
        this.logger.info(`Cleaned up ${backupsToDelete.length} old backups`);
      }
    } catch (error) {
      this.logger.error('Failed to cleanup old backups', error);
    }
  }

  private verifyBackupIntegrity(data: string, metadata: BackupMetadata): boolean {
    const calculatedChecksum = this.calculateChecksum(data);
    return calculatedChecksum === metadata.checksum;
  }

  private calculateChecksum(data: string): string {
    return this.encryption.generateHash(data);
  }

  private async compressData(data: string): Promise<string> {
    // Simple compression using built-in compression
    // In production, use a proper compression library
    try {
      const compressed = new TextEncoder().encode(data);
      return btoa(String.fromCharCode(...compressed));
    } catch (error) {
      this.logger.warn('Compression failed, using uncompressed data', error);
      return data;
    }
  }

  private async decompressData(data: string): Promise<string> {
    try {
      const compressed = Uint8Array.from(atob(data), c => c.charCodeAt(0));
      return new TextDecoder().decode(compressed);
    } catch (error) {
      this.logger.warn('Decompression failed, assuming uncompressed data', error);
      return data;
    }
  }

  private generateBackupId(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 8);
    return `backup-${timestamp}-${random}`;
  }

  private startAutoBackup(): void {
    this.backupTimer = setInterval(async () => {
      try {
        await this.createBackup('Automatic backup');
      } catch (error) {
        this.logger.error('Auto backup failed', error);
      }
    }, this.config.backupInterval);

    this.logger.info('Auto backup started', {
      interval: this.config.backupInterval,
      maxBackups: this.config.maxBackups
    });
  }

  stopAutoBackup(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = undefined;
      this.logger.info('Auto backup stopped');
    }
  }

  getBackupStats(): {
    totalBackups: number;
    totalSize: number;
    oldestBackup?: string;
    newestBackup?: string;
    autoBackupEnabled: boolean;
  } {
    // This would typically query the database for real stats
    // For now, return mock data
    return {
      totalBackups: 7,
      totalSize: 1024 * 1024 * 50, // 50MB
      oldestBackup: '2024-01-01T00:00:00Z',
      newestBackup: new Date().toISOString(),
      autoBackupEnabled: this.config.autoBackup
    };
  }

  destroy(): void {
    this.stopAutoBackup();
    this.logger.info('Backup manager destroyed');
  }
}