import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.ts';
import { rateLimitMiddleware as rateLimit } from '../middleware/rateLimit.middleware.ts';
import { handleValidationErrors } from '../middleware/validation.middleware.ts';
import { query } from 'express-validator';

// Import services
import AnalyticsService from '../services/analytics.service.ts';
const analyticsService = new AnalyticsService();

const router = express.Router();

// Validation rules
const dateRangeValidation = [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('period').optional().isIn(['day', 'week', 'month', 'quarter', 'year']).withMessage('Invalid period')
];

// GET /api/analytics/dashboard - Get dashboard statistics
router.get('/dashboard', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'month' } = req.query;

    const dashboardStats = await analyticsService.getDashboardStats(userId, {
      startDate,
      endDate,
      period
    });

    res.json({
      success: true,
      data: dashboardStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// GET /api/analytics/team/:teamId - Get team analytics
router.get('/team/:teamId', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { teamId } = req.params;
    const { startDate, endDate, period = 'month' } = req.query;

    const teamAnalytics = await analyticsService.getTeamAnalytics(teamId, userId, {
      startDate,
      endDate,
      period
    });

    res.json({
      success: true,
      data: teamAnalytics
    });
  } catch (error) {
    console.error('Error fetching team analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/player/:playerId - Get player analytics
router.get('/player/:playerId', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerId } = req.params;
    const { startDate, endDate, period = 'month' } = req.query;

    const playerAnalytics = await analyticsService.getPlayerAnalytics(playerId, userId, {
      startDate,
      endDate,
      period
    });

    res.json({
      success: true,
      data: playerAnalytics
    });
  } catch (error) {
    console.error('Error fetching player analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/matches - Get match analytics
router.get('/matches', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'month', teamId } = req.query;

    const matchAnalytics = await analyticsService.getMatchAnalytics(userId, {
      startDate,
      endDate,
      period,
      teamId
    });

    res.json({
      success: true,
      data: matchAnalytics
    });
  } catch (error) {
    console.error('Error fetching match analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch match analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/performance - Get performance metrics
router.get('/performance', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'month', teamId, playerId } = req.query;

    const performanceMetrics = await analyticsService.getPerformanceMetrics(userId, {
      startDate,
      endDate,
      period,
      teamId,
      playerId
    });

    res.json({
      success: true,
      data: performanceMetrics
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics',
      error: error.message
    });
  }
});

// GET /api/analytics/attendance - Get attendance analytics
router.get('/attendance', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'month', teamId } = req.query;

    const attendanceAnalytics = await analyticsService.getAttendanceAnalytics(userId, {
      startDate,
      endDate,
      period,
      teamId
    });

    res.json({
      success: true,
      data: attendanceAnalytics
    });
  } catch (error) {
    console.error('Error fetching attendance analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/goals - Get goal analytics
router.get('/goals', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'month', teamId, playerId } = req.query;

    const goalAnalytics = await analyticsService.getGoalAnalytics(userId, {
      startDate,
      endDate,
      period,
      teamId,
      playerId
    });

    res.json({
      success: true,
      data: goalAnalytics
    });
  } catch (error) {
    console.error('Error fetching goal analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goal analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/assists - Get assist analytics
router.get('/assists', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'month', teamId, playerId } = req.query;

    const assistAnalytics = await analyticsService.getAssistAnalytics(userId, {
      startDate,
      endDate,
      period,
      teamId,
      playerId
    });

    res.json({
      success: true,
      data: assistAnalytics
    });
  } catch (error) {
    console.error('Error fetching assist analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assist analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/discipline - Get discipline analytics
router.get('/discipline', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'month', teamId, playerId } = req.query;

    const disciplineAnalytics = await analyticsService.getDisciplineAnalytics(userId, {
      startDate,
      endDate,
      period,
      teamId,
      playerId
    });

    res.json({
      success: true,
      data: disciplineAnalytics
    });
  } catch (error) {
    console.error('Error fetching discipline analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discipline analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/trends - Get trend analysis
router.get('/trends', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'month', teamId, metric } = req.query;

    const trends = await analyticsService.getTrendAnalysis(userId, {
      startDate,
      endDate,
      period,
      teamId,
      metric
    });

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching trend analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trend analysis',
      error: error.message
    });
  }
});

// GET /api/analytics/comparison - Get comparison analytics
router.get('/comparison', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { teamIds, playerIds, metric, period = 'month' } = req.query;

    const comparison = await analyticsService.getComparisonAnalytics(userId, {
      teamIds: teamIds ? teamIds.split(',') : [],
      playerIds: playerIds ? playerIds.split(',') : [],
      metric,
      period
    });

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error fetching comparison analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comparison analytics',
      error: error.message
    });
  }
});

// POST /api/analytics/export - Export analytics data
router.post('/export', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      type = 'dashboard',
      format = 'csv',
      startDate,
      endDate,
      teamId,
      playerId,
      metrics = []
    } = req.body;

    const exportData = await analyticsService.exportAnalytics(userId, {
      type,
      format,
      startDate,
      endDate,
      teamId,
      playerId,
      metrics
    });

    res.json({
      success: true,
      message: 'Export generated successfully',
      data: exportData
    });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/reports - Get available reports
router.get('/reports', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { teamId } = req.query;

    const reports = await analyticsService.getAvailableReports(userId, { teamId });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
});

// POST /api/analytics/reports/generate - Generate custom report
router.post('/reports/generate', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name,
      description,
      type,
      parameters,
      schedule
    } = req.body;

    const report = await analyticsService.generateCustomReport(userId, {
      name,
      description,
      type,
      parameters,
      schedule
    });

    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      data: report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
});

// GET /api/analytics/insights - Get AI-powered insights
router.get('/insights', authenticateToken, rateLimit, dateRangeValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, teamId, playerId } = req.query;

    const insights = await analyticsService.getAIInsights(userId, {
      startDate,
      endDate,
      teamId,
      playerId
    });

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insights',
      error: error.message
    });
  }
});

// GET /api/analytics/predictions - Get performance predictions
router.get('/predictions', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { teamId, playerId, horizon = 30 } = req.query;

    const predictions = await analyticsService.getPerformancePredictions(userId, {
      teamId,
      playerId,
      horizon: parseInt(horizon)
    });

    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch predictions',
      error: error.message
    });
  }
});

// GET /api/analytics/benchmarks - Get performance benchmarks
router.get('/benchmarks', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { teamId, playerId, position, ageGroup } = req.query;

    const benchmarks = await analyticsService.getPerformanceBenchmarks(userId, {
      teamId,
      playerId,
      position,
      ageGroup
    });

    res.json({
      success: true,
      data: benchmarks
    });
  } catch (error) {
    console.error('Error fetching benchmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch benchmarks',
      error: error.message
    });
  }
});

export default router; 