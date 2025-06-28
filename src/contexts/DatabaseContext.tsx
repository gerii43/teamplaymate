import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DatabaseManager } from '@/lib/database/database-manager';
import { BackupManager } from '@/lib/database/backup-manager';
import { Logger } from '@/lib/utils/logger';

interface DatabaseContextType {
  databaseManager: DatabaseManager | null;
  backupManager: BackupManager | null;
  isInitialized: boolean;
  isOnline: boolean;
  syncStatus: any;
  performanceMetrics: any;
  error: string | null;
  initializeDatabase: () => Promise<void>;
  forceSync: () => Promise<void>;
  createBackup: () => Promise<void>;
  clearCache: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [databaseManager, setDatabaseManager] = useState<DatabaseManager | null>(null);
  const [backupManager, setBackupManager] = useState<BackupManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [error, setError] = useState<string | null>(null);
  
  const logger = new Logger('DatabaseProvider');

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      logger.info('Application is online');
      if (databaseManager) {
        databaseManager.forcSync().catch(err => 
          logger.error('Failed to sync after coming online', err)
        );
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      logger.info('Application is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [databaseManager]);

  useEffect(() => {
    // Update sync status and performance metrics periodically
    if (databaseManager && isInitialized) {
      const interval = setInterval(async () => {
        try {
          const [status, metrics] = await Promise.all([
            databaseManager.getSyncStatus(),
            databaseManager.getPerformanceMetrics()
          ]);
          
          setSyncStatus(status);
          setPerformanceMetrics(metrics);
        } catch (err) {
          logger.error('Failed to update status', err);
        }
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [databaseManager, isInitialized]);

  const initializeDatabase = async (): Promise<void> => {
    try {
      setError(null);
      logger.info('Initializing database...');

      const dbManager = new DatabaseManager();
      await dbManager.initialize();
      
      const bkManager = new BackupManager(dbManager, {
        autoBackup: true,
        backupInterval: 24 * 60 * 60 * 1000, // 24 hours
        maxBackups: 7
      });

      setDatabaseManager(dbManager);
      setBackupManager(bkManager);
      setIsInitialized(true);
      
      logger.info('Database initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('Failed to initialize database', err);
      throw err;
    }
  };

  const forceSync = async (): Promise<void> => {
    if (!databaseManager) {
      throw new Error('Database not initialized');
    }

    try {
      await databaseManager.forcSync();
      logger.info('Force sync completed');
    } catch (err) {
      logger.error('Force sync failed', err);
      throw err;
    }
  };

  const createBackup = async (): Promise<void> => {
    if (!backupManager) {
      throw new Error('Backup manager not initialized');
    }

    try {
      await backupManager.createBackup('Manual backup');
      logger.info('Manual backup created');
    } catch (err) {
      logger.error('Manual backup failed', err);
      throw err;
    }
  };

  const clearCache = (): void => {
    if (databaseManager) {
      databaseManager.clearCache();
      logger.info('Cache cleared');
    }
  };

  const value: DatabaseContextType = {
    databaseManager,
    backupManager,
    isInitialized,
    isOnline,
    syncStatus,
    performanceMetrics,
    error,
    initializeDatabase,
    forceSync,
    createBackup,
    clearCache
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};