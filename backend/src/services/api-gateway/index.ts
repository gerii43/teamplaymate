import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../../shared/config';
import { logger, morganStream } from '../../shared/utils/logger';
import { errorHandler, notFoundHandler } from '../../shared/middleware/error.middleware';
import { generalRateLimit } from '../../shared/middleware/rate-limit.middleware';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { metricsMiddleware } from '../../shared/middleware/metrics.middleware';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: morganStream }));

// Rate limiting
app.use(generalRateLimit);

// Metrics collection
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API Gateway routes with service discovery
const services = {
  user: 'http://user-service:3001',
  team: 'http://team-service:3002',
  match: 'http://match-service:3003',
  analytics: 'http://analytics-service:3004',
  notification: 'http://notification-service:3005',
  file: 'http://file-service:3006',
};

// Proxy configuration for each service
Object.entries(services).forEach(([serviceName, serviceUrl]) => {
  app.use(`/api/v1/${serviceName}`, createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/v1/${serviceName}`]: '',
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add correlation ID for request tracing
      const correlationId = req.headers['x-correlation-id'] || 
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      proxyReq.setHeader('x-correlation-id', correlationId);
      
      // Forward user information
      if ((req as any).user) {
        proxyReq.setHeader('x-user-id', (req as any).user.id);
        proxyReq.setHeader('x-user-role', (req as any).user.role);
      }
    },
    onError: (err, req, res) => {
      logger.error(`Proxy error for ${serviceName}:`, err);
      res.status(503).json({
        error: 'Service temporarily unavailable',
        service: serviceName,
      });
    },
  }));
});

// Authentication routes (handled by gateway)
app.use('/api/v1/auth', authMiddleware.authenticate);

// GraphQL endpoint
app.use('/graphql', createProxyMiddleware({
  target: 'http://graphql-gateway:4000',
  changeOrigin: true,
}));

// API documentation
app.use('/docs', express.static('docs'));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port || 3000;

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Environment: ${config.env}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

export default app;