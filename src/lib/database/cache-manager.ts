import { Logger } from '../utils/logger';
import { PerformanceMonitor } from '../utils/performance-monitor';
import { EncryptionService } from '../security/encryption';

interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
  encryptSensitiveData: boolean;
}

export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private logger = new Logger('CacheManager');
  private performanceMonitor = new PerformanceMonitor();
  private encryption = new EncryptionService();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      encryptSensitiveData: true,
      ...config
    };

    this.startCleanupTimer();
  }

  set<T>(key: string, data: T, ttl?: number): void {
    try {
      const now = Date.now();
      const entryTTL = ttl || this.config.defaultTTL;

      // Encrypt sensitive data if configured
      let processedData: T = data;
      if (this.config.encryptSensitiveData && this.isSensitiveData(key)) {
        processedData = this.encryption.encryptObject(data) as T;
      }

      const entry: CacheEntry<T> = {
        key,
        data: processedData,
        timestamp: now,
        ttl: entryTTL,
        accessCount: 0,
        lastAccessed: now
      };

      // Remove oldest entries if cache is full
      if (this.cache.size >= this.config.maxSize) {
        this.evictLeastRecentlyUsed();
      }

      this.cache.set(key, entry);
      this.logger.debug(`Cache entry set: ${key}`, { ttl: entryTTL });
    } catch (error) {
      this.logger.error(`Failed to set cache entry: ${key}`, error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.performanceMonitor.recordCacheHit(false);
        return null;
      }

      const now = Date.now();
      
      // Check if entry has expired
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.performanceMonitor.recordCacheHit(false);
        this.logger.debug(`Cache entry expired: ${key}`);
        return null;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = now;

      this.performanceMonitor.recordCacheHit(true);

      // Decrypt sensitive data if needed
      let data = entry.data;
      if (this.config.encryptSensitiveData && this.isSensitiveData(key)) {
        data = this.encryption.decryptObject(entry.data);
      }

      this.logger.debug(`Cache hit: ${key}`, { accessCount: entry.accessCount });
      return data as T;
    } catch (error) {
      this.logger.error(`Failed to get cache entry: ${key}`, error);
      this.performanceMonitor.recordCacheHit(false);
      return null;
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.logger.debug(`Cache entry deleted: ${key}`);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.logger.info('Cache cleared');
  }

  invalidatePattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let count = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    this.logger.info(`Invalidated ${count} cache entries matching pattern: ${pattern}`);
    return count;
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
    topKeys: Array<{ key: string; accessCount: number; lastAccessed: number }>;
  } {
    const entries = Array.from(this.cache.values());
    const totalAccesses = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const hits = entries.filter(entry => entry.accessCount > 0).length;

    // Estimate memory usage (rough calculation)
    const memoryUsage = entries.reduce((sum, entry) => {
      return sum + JSON.stringify(entry).length * 2; // Rough estimate in bytes
    }, 0);

    // Get top accessed keys
    const topKeys = entries
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 10)
      .map(entry => ({
        key: entry.key,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed
      }));

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: totalAccesses > 0 ? (hits / totalAccesses) * 100 : 0,
      memoryUsage,
      topKeys
    };
  }

  private evictLeastRecentlyUsed(): void {
    let oldestEntry: CacheEntry<any> | null = null;
    let oldestKey = '';

    for (const [key, entry] of this.cache.entries()) {
      if (!oldestEntry || entry.lastAccessed < oldestEntry.lastAccessed) {
        oldestEntry = entry;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.logger.debug(`Evicted LRU cache entry: ${oldestKey}`);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      this.logger.debug(`Cleaned up ${expiredCount} expired cache entries`);
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private isSensitiveData(key: string): boolean {
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /secret/i,
      /key/i,
      /auth/i,
      /credential/i,
      /personal/i,
      /medical/i
    ];

    return sensitivePatterns.some(pattern => pattern.test(key));
  }

  // Preload frequently accessed data
  async preload(keys: string[], dataLoader: (key: string) => Promise<any>): Promise<void> {
    const promises = keys.map(async (key) => {
      if (!this.has(key)) {
        try {
          const data = await dataLoader(key);
          this.set(key, data);
        } catch (error) {
          this.logger.error(`Failed to preload cache entry: ${key}`, error);
        }
      }
    });

    await Promise.all(promises);
    this.logger.info(`Preloaded ${keys.length} cache entries`);
  }

  // Batch operations
  setMany<T>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    entries.forEach(({ key, data, ttl }) => {
      this.set(key, data, ttl);
    });
  }

  getMany<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    keys.forEach(key => {
      result[key] = this.get<T>(key);
    });
    return result;
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
    this.logger.info('Cache manager destroyed');
  }
}