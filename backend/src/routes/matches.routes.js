const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { rateLimit } = require('../middleware/rateLimit.middleware');
const DatabaseService = require('../services/database.service');

const router = express.Router();
const db = new DatabaseService();

// Apply rate limiting to all match routes
router.use(rateLimit('api'));

// Get all matches (with pagination and filtering)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sport').optional().isString().withMessage('Sport must be a string'),
  query('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
  query('team_id').optional().isUUID().withMessage('Invalid team ID'),
  query('date_from').optional().isISO8601().withMessage('Invalid date format'),
  query('date_to').optional().isISO8601().withMessage('Invalid date format'),
  query('search').optional().isString().withMessage('Search must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sport, 
      status, 
      team_id, 
      date_from, 
      date_to, 
      search 
    } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (sport) filters.sport = sport;
    if (status) filters.status = status;
    if (team_id) filters.team_id = team_id;
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;
    if (search) filters.search = search;

    const matches = await db.getMatches(filters, { limit: parseInt(limit), offset });
    const total = await db.getMatchesCount(filters);

    res.json({
      success: true,
      data: matches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch matches' });
  }
});

// Get match by ID
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const match = await db.getMatchById(id);
    
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Get match details
    const details = await db.getMatchDetails(id);
    match.details = details;

    // Get match statistics
    const stats = await db.getMatchStats(id);
    match.stats = stats;

    // Get match events
    const events = await db.getMatchEvents(id);
    match.events = events;

    res.json({ success: true, data: match });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch match' });
  }
});

// Create new match
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('sport').isString().withMessage('Sport is required'),
  body('team_id').isUUID().withMessage('Invalid team ID'),
  body('opponent').optional().isString().withMessage('Opponent must be a string'),
  body('opponent_team_id').optional().isUUID().withMessage('Invalid opponent team ID'),
  body('match_date').isISO8601().withMessage('Invalid match date'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('match_type').optional().isIn(['friendly', 'league', 'tournament', 'cup']).withMessage('Invalid match type'),
  body('max_players').optional().isInt({ min: 1, max: 50 }).withMessage('Max players must be between 1 and 50'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { 
      title, 
      sport, 
      team_id, 
      opponent, 
      opponent_team_id, 
      match_date, 
      location, 
      description, 
      match_type = 'friendly',
      max_players 
    } = req.body;
    const userId = req.user.id;

    // Check if user is team captain or admin
    const member = await db.getTeamMember(team_id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const matchData = {
      title,
      sport,
      team_id,
      opponent,
      opponent_team_id,
      match_date: new Date(match_date),
      location,
      description,
      match_type,
      max_players: max_players || 20,
      created_by: userId,
      status: 'upcoming'
    };

    const match = await db.createMatch(matchData);
    res.status(201).json({ success: true, data: match });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ success: false, message: 'Failed to create match' });
  }
});

// Update match
router.put('/:id', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid match ID'),
  body('title').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('opponent').optional().isString().withMessage('Opponent must be a string'),
  body('match_date').optional().isISO8601().withMessage('Invalid match date'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Check if user is team captain or admin
    const match = await db.getMatchById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const member = await db.getTeamMember(match.team_id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    // Convert date if provided
    if (updateData.match_date) {
      updateData.match_date = new Date(updateData.match_date);
    }

    const updatedMatch = await db.updateMatch(id, updateData);
    res.json({ success: true, data: updatedMatch });
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ success: false, message: 'Failed to update match' });
  }
});

// Delete match
router.delete('/:id', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is team captain or admin
    const match = await db.getMatchById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const member = await db.getTeamMember(match.team_id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    // Only allow deletion of upcoming matches
    if (match.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Can only delete upcoming matches' });
    }

    await db.deleteMatch(id);
    res.json({ success: true, message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ success: false, message: 'Failed to delete match' });
  }
});

// Match attendance management
router.post('/:id/attendance', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid match ID'),
  body('status').isIn(['attending', 'not_attending', 'maybe']).withMessage('Invalid attendance status'),
  body('notes').optional().isLength({ max: 200 }).withMessage('Notes must be less than 200 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    // Check if match exists
    const match = await db.getMatchById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Check if user is team member
    const member = await db.getTeamMember(match.team_id, userId);
    if (!member) {
      return res.status(403).json({ success: false, message: 'You are not a team member' });
    }

    await db.updateMatchAttendance(id, userId, status, notes);
    res.json({ success: true, message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ success: false, message: 'Failed to update attendance' });
  }
});

// Get match attendance
router.get('/:id/attendance', [
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await db.getMatchAttendance(id);
    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error fetching match attendance:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
});

// Match events (for live updates)
router.post('/:id/events', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid match ID'),
  body('type').isIn(['goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'injury', 'other']).withMessage('Invalid event type'),
  body('player_id').optional().isUUID().withMessage('Invalid player ID'),
  body('minute').optional().isInt({ min: 0, max: 120 }).withMessage('Minute must be between 0 and 120'),
  body('description').optional().isLength({ max: 200 }).withMessage('Description must be less than 200 characters'),
  body('team_side').optional().isIn(['home', 'away']).withMessage('Team side must be home or away'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { type, player_id, minute, description, team_side } = req.body;
    const userId = req.user.id;

    // Check if match exists and is ongoing
    const match = await db.getMatchById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.status !== 'ongoing') {
      return res.status(400).json({ success: false, message: 'Can only add events to ongoing matches' });
    }

    // Check if user is team captain or admin
    const member = await db.getTeamMember(match.team_id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const eventData = {
      match_id: id,
      type,
      player_id,
      minute,
      description,
      team_side,
      created_by: userId
    };

    const event = await db.createMatchEvent(eventData);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Error creating match event:', error);
    res.status(500).json({ success: false, message: 'Failed to create match event' });
  }
});

// Get match events
router.get('/:id/events', [
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const events = await db.getMatchEvents(id);
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching match events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch match events' });
  }
});

// Update match score
router.patch('/:id/score', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid match ID'),
  body('home_score').optional().isInt({ min: 0 }).withMessage('Home score must be a non-negative integer'),
  body('away_score').optional().isInt({ min: 0 }).withMessage('Away score must be a non-negative integer'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { home_score, away_score } = req.body;
    const userId = req.user.id;

    // Check if match exists
    const match = await db.getMatchById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Check if user is team captain or admin
    const member = await db.getTeamMember(match.team_id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const scoreData = {};
    if (home_score !== undefined) scoreData.home_score = home_score;
    if (away_score !== undefined) scoreData.away_score = away_score;

    const updatedMatch = await db.updateMatchScore(id, scoreData);
    res.json({ success: true, data: updatedMatch });
  } catch (error) {
    console.error('Error updating match score:', error);
    res.status(500).json({ success: false, message: 'Failed to update match score' });
  }
});

// Start match
router.post('/:id/start', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if match exists
    const match = await db.getMatchById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Match is not in upcoming status' });
    }

    // Check if user is team captain or admin
    const member = await db.getTeamMember(match.team_id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const updatedMatch = await db.updateMatch(id, { status: 'ongoing', start_time: new Date() });
    res.json({ success: true, data: updatedMatch });
  } catch (error) {
    console.error('Error starting match:', error);
    res.status(500).json({ success: false, message: 'Failed to start match' });
  }
});

// End match
router.post('/:id/end', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if match exists
    const match = await db.getMatchById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.status !== 'ongoing') {
      return res.status(400).json({ success: false, message: 'Match is not in ongoing status' });
    }

    // Check if user is team captain or admin
    const member = await db.getTeamMember(match.team_id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const updatedMatch = await db.updateMatch(id, { status: 'completed', end_time: new Date() });
    res.json({ success: true, data: updatedMatch });
  } catch (error) {
    console.error('Error ending match:', error);
    res.status(500).json({ success: false, message: 'Failed to end match' });
  }
});

// Get match analytics
router.get('/:id/analytics', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if match exists
    const match = await db.getMatchById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Check if user is team member
    const member = await db.getTeamMember(match.team_id, userId);
    if (!member && !req.user.is_admin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const analytics = await db.getMatchAnalytics(id);
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Error fetching match analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch match analytics' });
  }
});

// Get upcoming matches for a user
router.get('/user/upcoming', [
  authenticateToken,
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;

    const matches = await db.getUserUpcomingMatches(userId, parseInt(limit));
    res.json({ success: true, data: matches });
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming matches' });
  }
});

// Get match statistics
router.get('/:id/statistics', [
  param('id').isUUID().withMessage('Invalid match ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await db.getMatchStatistics(id);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching match statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch match statistics' });
  }
});

module.exports = router; 