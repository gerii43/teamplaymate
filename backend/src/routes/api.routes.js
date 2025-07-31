const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const teamsRoutes = require('./teams.routes');
const playersRoutes = require('./players.routes');
const matchesRoutes = require('./matches.routes');
const chatbotRoutes = require('./chatbot.routes');
const subscriptionRoutes = require('./subscription.routes');
const uploadRoutes = require('./upload.routes');
const analyticsRoutes = require('./analytics.routes');
const userRoutes = require('./user.routes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    services: {
      database: 'connected',
      redis: 'connected',
      ai: 'available',
      payments: 'available',
      storage: 'available'
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    name: 'Statsor API',
    version: '1.0.0',
    description: 'Complete API for Statsor football analytics platform',
    endpoints: {
      auth: {
        base: '/api/auth',
        endpoints: [
          'POST /register - User registration',
          'POST /login - User login',
          'POST /google - Google OAuth',
          'POST /logout - User logout',
          'GET /me - Get current user'
        ]
      },
      teams: {
        base: '/api/teams',
        endpoints: [
          'GET / - List user teams',
          'POST / - Create team',
          'GET /:id - Get team details',
          'PUT /:id - Update team',
          'DELETE /:id - Delete team',
          'GET /:id/players - Get team players'
        ]
      },
      players: {
        base: '/api/players',
        endpoints: [
          'GET / - List players',
          'POST / - Add player',
          'GET /:id - Get player details',
          'PUT /:id - Update player',
          'DELETE /:id - Delete player',
          'GET /:id/stats - Get player statistics'
        ]
      },
      matches: {
        base: '/api/matches',
        endpoints: [
          'GET / - List matches',
          'POST / - Create match',
          'GET /:id - Get match details',
          'PUT /:id - Update match',
          'DELETE /:id - Delete match',
          'GET /:id/stats - Get match statistics',
          'POST /:id/events - Add match event'
        ]
      },
      chatbot: {
        base: '/api/chatbot',
        endpoints: [
          'POST /chat - Send message to AI',
          'GET /history - Get chat history',
          'POST /suggestions - Get AI suggestions',
          'GET /search - Internet search'
        ]
      },
      subscriptions: {
        base: '/api/subscriptions',
        endpoints: [
          'GET /plans - Get available plans',
          'POST /create - Create subscription',
          'GET /current - Get current subscription',
          'POST /cancel - Cancel subscription',
          'POST /upgrade - Upgrade plan'
        ]
      },
      upload: {
        base: '/api/upload',
        endpoints: [
          'POST /image - Upload image',
          'POST /document - Upload document',
          'DELETE /:id - Delete file'
        ]
      },
      analytics: {
        base: '/api/analytics',
        endpoints: [
          'GET /dashboard - Get dashboard stats',
          'GET /team/:id - Get team analytics',
          'GET /player/:id - Get player analytics',
          'POST /export - Export data'
        ]
      }
    }
  });
});

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/teams', teamsRoutes);
router.use('/players', playersRoutes);
router.use('/matches', matchesRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/upload', uploadRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/user', userRoutes);

module.exports = router; 