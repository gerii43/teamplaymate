import { Request, Response, NextFunction } from 'express';
import { register, Counter, Histogram, Gauge } from 'prom-client';
import { logger } from '../utils/logger';

// Metrics definitions
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service']
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'service'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['service']
});

const databaseQueryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table', 'service'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2]
});

const cacheHitRate = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_type', 'service']
});

const cacheMissRate = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_type', 'service']
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const serviceName = process.env.SERVICE_NAME || 'unknown';

  // Increment active connections
  activeConnections.inc({ service: serviceName });

  // Override res.end to capture metrics
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    const statusCode = res.statusCode.toString();

    // Record metrics
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: statusCode,
      service: serviceName
    });

    httpRequestDuration.observe({
      method: req.method,
      route,
      status_code: statusCode,
      service: serviceName
    }, duration);

    // Decrement active connections
    activeConnections.dec({ service: serviceName });

    // Log request
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}s`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Metrics endpoint
export const metricsEndpoint = (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
};

// Database metrics helpers
export const recordDatabaseQuery = (operation: string, table: string, duration: number) => {
  const serviceName = process.env.SERVICE_NAME || 'unknown';
  databaseQueryDuration.observe({
    operation,
    table,
    service: serviceName
  }, duration / 1000);
};

export const recordCacheHit = (cacheType: string = 'redis') => {
  const serviceName = process.env.SERVICE_NAME || 'unknown';
  cacheHitRate.inc({
    cache_type: cacheType,
    service: serviceName
  });
};

export const recordCacheMiss = (cacheType: string = 'redis') => {
  const serviceName = process.env.SERVICE_NAME || 'unknown';
  cacheMissRate.inc({
    cache_type: cacheType,
    service: serviceName
  });
};

// Custom metrics for business logic
export const businessMetrics = {
  matchesCreated: new Counter({
    name: 'matches_created_total',
    help: 'Total number of matches created',
    labelNames: ['sport', 'service']
  }),

  playersRegistered: new Counter({
    name: 'players_registered_total',
    help: 'Total number of players registered',
    labelNames: ['position', 'service']
  }),

  analyticsGenerated: new Counter({
    name: 'analytics_generated_total',
    help: 'Total number of analytics reports generated',
    labelNames: ['type', 'service']
  }),

  liveMatchEvents: new Counter({
    name: 'live_match_events_total',
    help: 'Total number of live match events',
    labelNames: ['event_type', 'service']
  })
};