import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(config.database.redis.url, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttl, serializedValue);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      throw error;
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      
      return JSON.parse(value);
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async flush(): Promise<void> {
    try {
      await this.redis.flushall();
      logger.info('Cache flushed successfully');
    } catch (error) {
      logger.error('Cache flush error:', error);
      throw error;
    }
  }

  async setHash(key: string, field: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.hset(key, field, serializedValue);
    } catch (error) {
      logger.error(`Cache hash set error for key ${key}, field ${field}:`, error);
      throw error;
    }
  }

  async getHash(key: string, field: string): Promise<any | null> {
    try {
      const value = await this.redis.hget(key, field);
      if (!value) return null;
      
      return JSON.parse(value);
    } catch (error) {
      logger.error(`Cache hash get error for key ${key}, field ${field}:`, error);
      return null;
    }
  }

  async deleteHash(key: string, field: string): Promise<void> {
    try {
      await this.redis.hdel(key, field);
    } catch (error) {
      logger.error(`Cache hash delete error for key ${key}, field ${field}:`, error);
      throw error;
    }
  }
}