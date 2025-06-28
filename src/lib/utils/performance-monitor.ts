import { Logger } from './logger';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface DatabaseMetrics {
  query_time: number;
  sync_duration: number;
  cache_hit_rate: number;
  offline_queue_size: number;
  conflict_resolution_time: number;
}

export class PerformanceMonitor {
  private logger = new Logger('PerformanceMonitor');
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;

  recordMetric(name: string, value: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metrics.push(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    this.logger.debug(`Performance metric recorded: ${name}`, { value, metadata });
  }

  recordQueryTime(duration: number, query: string, database: string): void {
    this.recordMetric('query_time', duration, { query, database });
  }

  recordSyncDuration(duration: number): void {
    this.recordMetric('sync_duration', duration);
  }

  recordCacheHit(hit: boolean): void {
    this.recordMetric('cache_hit', hit ? 1 : 0);
  }

  recordOfflineQueueSize(size: number): void {
    this.recordMetric('offline_queue_size', size);
  }

  recordConflictResolutionTime(duration: number): void {
    this.recordMetric('conflict_resolution_time', duration);
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, { error: true });
      throw error;
    }
  }

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, { error: true });
      throw error;
    }
  }

  getMetrics(name?: string, since?: Date): PerformanceMetric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (since) {
      filtered = filtered.filter(m => new Date(m.timestamp) >= since);
    }

    return filtered;
  }

  getAverageMetric(name: string, since?: Date): number {
    const metrics = this.getMetrics(name, since);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  getPercentile(name: string, percentile: number, since?: Date): number {
    const metrics = this.getMetrics(name, since);
    if (metrics.length === 0) return 0;

    const sorted = metrics.map(m => m.value).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  getDatabaseMetrics(since?: Date): DatabaseMetrics {
    const sinceDate = since || new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

    return {
      query_time: this.getAverageMetric('query_time', sinceDate),
      sync_duration: this.getAverageMetric('sync_duration', sinceDate),
      cache_hit_rate: this.getCacheHitRate(sinceDate),
      offline_queue_size: this.getAverageMetric('offline_queue_size', sinceDate),
      conflict_resolution_time: this.getAverageMetric('conflict_resolution_time', sinceDate)
    };
  }

  private getCacheHitRate(since: Date): number {
    const cacheMetrics = this.getMetrics('cache_hit', since);
    if (cacheMetrics.length === 0) return 0;

    const hits = cacheMetrics.filter(m => m.value === 1).length;
    return (hits / cacheMetrics.length) * 100;
  }

  getPerformanceReport(): {
    summary: DatabaseMetrics;
    trends: Record<string, number[]>;
    alerts: string[];
  } {
    const summary = this.getDatabaseMetrics();
    const trends = this.getTrends();
    const alerts = this.generateAlerts(summary);

    return { summary, trends, alerts };
  }

  private getTrends(): Record<string, number[]> {
    const metricNames = ['query_time', 'sync_duration', 'cache_hit_rate'];
    const trends: Record<string, number[]> = {};

    metricNames.forEach(name => {
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const metrics = this.getMetrics(name, last24Hours);
      
      // Group by hour and calculate averages
      const hourlyAverages: number[] = [];
      for (let i = 0; i < 24; i++) {
        const hourStart = new Date(last24Hours.getTime() + i * 60 * 60 * 1000);
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
        
        const hourMetrics = metrics.filter(m => {
          const timestamp = new Date(m.timestamp);
          return timestamp >= hourStart && timestamp < hourEnd;
        });

        if (hourMetrics.length > 0) {
          const average = hourMetrics.reduce((sum, m) => sum + m.value, 0) / hourMetrics.length;
          hourlyAverages.push(average);
        } else {
          hourlyAverages.push(0);
        }
      }
      
      trends[name] = hourlyAverages;
    });

    return trends;
  }

  private generateAlerts(metrics: DatabaseMetrics): string[] {
    const alerts: string[] = [];

    if (metrics.query_time > 1000) {
      alerts.push('High query response time detected');
    }

    if (metrics.sync_duration > 30000) {
      alerts.push('Sync operations taking longer than expected');
    }

    if (metrics.cache_hit_rate < 70) {
      alerts.push('Low cache hit rate - consider optimizing cache strategy');
    }

    if (metrics.offline_queue_size > 100) {
      alerts.push('Large offline queue - sync may be failing');
    }

    if (metrics.conflict_resolution_time > 5000) {
      alerts.push('Conflict resolution taking too long');
    }

    return alerts;
  }

  clearMetrics(): void {
    this.metrics = [];
    this.logger.info('Performance metrics cleared');
  }

  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      summary: this.getDatabaseMetrics(),
      report: this.getPerformanceReport()
    }, null, 2);
  }
}