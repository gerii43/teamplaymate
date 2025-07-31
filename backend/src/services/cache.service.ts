/**
 * Cache Service
 * Provides Redis-based caching functionality with automatic invalidation
 */

import Redis from 'ioredis';
import { logger } from '../utils/logger.js';
import { getEnv, getEnvNumber } from '../../../src/utils/envValidation.js';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
  serialize?: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  memory: number;
  uptime: number;
}

interface SessionData {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}

class CacheService {
  private static instance: CacheService;
  private client!: Redis;
  private isConnected: boolean = false;
  private stats = {
    hits: 0,
    misses: 0
  };

  private constructor() {
    this.initializeRedis();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Initialize Redis connection
   */
  private async initializeRedis(): Promise<void> {
    try {
      const redisUrl = getEnv('REDIS_URL', 'redis://localhost:6379');
      
      this.client = new Redis(redisUrl);

      this.client.on('connect', () => {
        logger.info('Redis connected');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        logger.error('Redis error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        logger.warn('Redis connection closed');
        this.isConnected = false;
      });

      // Test connection
      await this.client.ping();
      logger.info('Redis connection established');
    } catch (error) {
      logger.error('Failed to initialize Redis:', error);
      this.isConnected = false;
    }
  }

  /**
   * Check if Redis is connected
   */
  get isReady(): boolean {
    return this.isConnected && this.client?.status === 'ready';
  }

  /**
   * Set cache value
   */
  async set<T>(
    key: string,
    value: T,
    ttl: number = getEnvNumber('CACHE_DEFAULT_TTL', 3600),
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache set');
        return;
      }

      const fullKey = this.buildKey(key, options.prefix);
      const serializedValue = JSON.stringify(value);

      if (ttl > 0) {
        await this.client.setex(fullKey, ttl, serializedValue);
      } else {
        await this.client.set(fullKey, serializedValue);
      }

      logger.debug(`Cache set: ${fullKey}`);
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  /**
   * Get cache value
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache get');
        return null;
      }

      const fullKey = this.buildKey(key, options.prefix);
      const value = await this.client.get(fullKey);

      if (value === null) {
        this.stats.misses++;
        logger.debug(`Cache miss: ${fullKey}`);
        return null;
      }

      this.stats.hits++;
      logger.debug(`Cache hit: ${fullKey}`);
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete cache key
   */
  async delete(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache delete');
        return;
      }

      const { prefix = 'cache:' } = options;
      const fullKey = this.buildKey(key, prefix);

      await this.client.del(fullKey);
      logger.debug(`Cache deleted: ${fullKey}`);
    } catch (error) {
      logger.error('Error deleting cache:', error);
    }
  }

  /**
   * Delete multiple cache keys
   */
  async deleteMultiple(keys: string[], options: CacheOptions = {}): Promise<void> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache delete multiple');
        return;
      }

      const { prefix = 'cache:' } = options;
      const fullKeys = keys.map(key => this.buildKey(key, prefix));

      await this.client.del(fullKeys);
      logger.debug(`Cache deleted multiple: ${fullKeys.length} keys`);
    } catch (error) {
      logger.error('Error deleting multiple cache keys:', error);
    }
  }

  /**
   * Delete cache keys by pattern
   */
  async deleteByPattern(pattern: string, options: CacheOptions = {}): Promise<number> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache delete by pattern');
        return 0;
      }

      const { prefix = 'cache:' } = options;
      const fullPattern = this.buildKey(pattern, prefix);

      const keys = await this.client.keys(fullPattern);
      
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.debug(`Cache deleted by pattern: ${fullPattern} (${keys.length} keys)`);
      }

      return keys.length;
    } catch (error) {
      logger.error('Error deleting cache by pattern:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      if (!this.isReady) {
        return false;
      }

      const { prefix = 'cache:' } = options;
      const fullKey = this.buildKey(key, prefix);

      const result = await this.client.exists(fullKey);
      return result === 1;
    } catch (error) {
      logger.error('Error checking cache existence:', error);
      return false;
    }
  }

  /**
   * Get cache key TTL
   */
  async getTTL(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      if (!this.isReady) {
        return -1;
      }

      const { prefix = 'cache:' } = options;
      const fullKey = this.buildKey(key, prefix);

      return await this.client.ttl(fullKey);
    } catch (error) {
      logger.error('Error getting cache TTL:', error);
      return -1;
    }
  }

  /**
   * Set cache key TTL
   */
  async setTTL(key: string, ttl: number, options: CacheOptions = {}): Promise<void> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache TTL set');
        return;
      }

      const { prefix = 'cache:' } = options;
      const fullKey = this.buildKey(key, prefix);

      await this.client.expire(fullKey, ttl);
      logger.debug(`Cache TTL set: ${fullKey} (${ttl}s)`);
    } catch (error) {
      logger.error('Error setting cache TTL:', error);
    }
  }

  /**
   * Increment counter
   */
  async increment(key: string, amount: number = 1, options: CacheOptions = {}): Promise<number> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache increment');
        return 0;
      }

      const fullKey = this.buildKey(key, options.prefix);
      const result = await this.client.incrby(fullKey, amount);
      logger.debug(`Cache increment: ${fullKey} by ${amount}`);
      return result;
    } catch (error) {
      logger.error('Cache increment error:', error);
      return 0;
    }
  }

  /**
   * Decrement counter
   */
  async decrement(key: string, amount: number = 1, options: CacheOptions = {}): Promise<number> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache decrement');
        return 0;
      }

      const fullKey = this.buildKey(key, options.prefix);
      const result = await this.client.decrby(fullKey, amount);
      logger.debug(`Cache decrement: ${fullKey} by ${amount}`);
      return result;
    } catch (error) {
      logger.error('Cache decrement error:', error);
      return 0;
    }
  }

  /**
   * Get or set cache value (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key, options);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, fetch and store
      const value = await fetchFunction();
      await this.set(key, value, options.ttl || getEnvNumber('CACHE_DEFAULT_TTL', 3600), options);
      return value;
    } catch (error) {
      logger.error('Error in getOrSet:', error);
      // Fallback to fetch function if cache fails
      return await fetchFunction();
    }
  }

  /**
   * Session management
   */
  async setSession(sessionId: string, data: SessionData, ttl: number = 86400): Promise<void> {
    await this.set(sessionId, data, ttl, {
      prefix: 'session:'
    });
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    return await this.get<SessionData>(sessionId, {
      prefix: 'session:'
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.delete(sessionId, {
      prefix: 'session:'
    });
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (session) {
        session.lastActivity = new Date();
        await this.setSession(sessionId, session);
      }
    } catch (error) {
      logger.error('Error updating session activity:', error);
    }
  }

  /**
   * Rate limiting
   */
  async checkRateLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      if (!this.isReady) {
        return { allowed: true, remaining: limit, resetTime: Date.now() + window * 1000 };
      }

      const current = await this.increment(key, 1, { ttl: window });
      const resetTime = Date.now() + window * 1000;

      if (current === 1) {
        // First request, set TTL
        await this.setTTL(key, window);
      }

      const remaining = Math.max(0, limit - current);
      const allowed = current <= limit;

      return { allowed, remaining, resetTime };
    } catch (error) {
      logger.error('Error checking rate limit:', error);
      return { allowed: true, remaining: limit, resetTime: Date.now() + window * 1000 };
    }
  }

  /**
   * Cache warming
   */
  async warmCache<T>(
    keys: string[],
    fetchFunction: (key: string) => Promise<T>,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const promises = keys.map(async (key) => {
        try {
          const value = await fetchFunction(key);
          await this.set(key, value, options.ttl || getEnvNumber('CACHE_DEFAULT_TTL', 3600), options);
          logger.debug(`Cache warmed: ${key}`);
        } catch (error) {
          logger.error(`Error warming cache for key ${key}:`, error);
        }
      });

      await Promise.allSettled(promises);
      logger.info(`Cache warming completed for ${keys.length} keys`);
    } catch (error) {
      logger.error('Error warming cache:', error);
    }
  }

  /**
   * Cache invalidation
   */
  async invalidatePattern(pattern: string): Promise<number> {
    return await this.deleteByPattern(pattern);
  }

  async invalidateUserData(userId: string): Promise<void> {
    const patterns = [
      `user:${userId}:*`,
      `session:*`,
      `profile:${userId}`,
      `stats:${userId}:*`
    ];

    for (const pattern of patterns) {
      await this.deleteByPattern(pattern);
    }

    logger.info(`Invalidated cache for user: ${userId}`);
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    try {
      if (!this.isReady) {
        return {
          hits: this.stats.hits,
          misses: this.stats.misses,
          keys: 0,
          memory: 0,
          uptime: 0
        };
      }

      const keys = await this.client.dbsize();
      const memory = await this.client.memory('STATS');

      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys: keys || 0,
        memory: memory ? memory.length : 0,
        uptime: Date.now()
      };
    } catch (error) {
      logger.error('Cache stats error:', error);
      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys: 0,
        memory: 0,
        uptime: 0
      };
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    try {
      if (!this.isReady) {
        logger.warn('Redis not ready, skipping cache clear');
        return;
      }

      await this.client.flushdb();
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: string }> {
    try {
      if (!this.isReady) {
        return { status: 'unhealthy', details: 'Redis not connected' };
      }

      await this.client.ping();
      return { status: 'healthy', details: 'Redis is responding' };
    } catch (error) {
      logger.error('Cache health check failed:', error);
      return { status: 'unhealthy', details: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    try {
      if (this.client) {
        await this.client.quit();
        logger.info('Redis connection closed');
      }
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }

  /**
   * Get cache hit rate
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
    logger.info('Cache statistics reset');
  }

  private buildKey(key: string, prefix: string | undefined): string {
    return `${prefix || ''}${key}`;
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Export for direct use
export default cacheService; 