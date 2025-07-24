import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { validate } from '../../shared/middleware/validation.middleware';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

// Get analytics reports
router.get('/reports',
  validate({ query: { type: 'string', entityType: 'string', entityId: 'string' } }),
  analyticsController.getReports
);

// Generate team analytics
router.post('/team/:teamId',
  validate({ 
    params: { teamId: 'string' },
    body: { filters: 'object' }
  }),
  authMiddleware.authorize(['analytics.read'], ['coach', 'admin', 'analyst']),
  analyticsController.generateTeamAnalytics
);

// Generate player analytics
router.post('/player/:playerId',
  validate({ 
    params: { playerId: 'string' },
    body: { filters: 'object' }
  }),
  authMiddleware.authorize(['analytics.read'], ['coach', 'admin', 'analyst']),
  analyticsController.generatePlayerAnalytics
);

// Get real-time analytics
router.get('/realtime/:matchId',
  validate({ params: { matchId: 'string' } }),
  authMiddleware.authorize(['analytics.read'], ['coach', 'admin', 'analyst']),
  analyticsController.getRealtimeAnalytics
);

// Get performance trends
router.get('/trends/:entityType/:entityId',
  validate({ 
    params: { entityType: 'string', entityId: 'string' },
    query: { period: 'string', metric: 'string' }
  }),
  analyticsController.getPerformanceTrends
);

// Generate match analysis
router.post('/match/:matchId',
  validate({ 
    params: { matchId: 'string' },
    body: { analysisType: 'string' }
  }),
  authMiddleware.authorize(['analytics.read'], ['coach', 'admin', 'analyst']),
  analyticsController.generateMatchAnalysis
);

export { router as analyticsRoutes };