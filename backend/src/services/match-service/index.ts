import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from '../../shared/config';
import { logger, morganStream } from '../../shared/utils/logger';
import { errorHandler, notFoundHandler } from '../../shared/middleware/error.middleware';
import { generalRateLimit } from '../../shared/middleware/rate-limit.middleware';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { metricsMiddleware } from '../../shared/middleware/metrics.middleware';
import { matchRoutes } from './match.routes';

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
    service: 'match-service'
  });
});

// Authentication middleware
app.use('/api', authMiddleware.authenticate);

// Match routes
app.use('/api/matches', matchRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port || 3003;

app.listen(PORT, () => {
  logger.info(`Match Service running on port ${PORT}`);
  logger.info(`Environment: ${config.env}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

export default app;