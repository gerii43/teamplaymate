const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { rateLimit } = require('../middleware/rateLimit.middleware');
const DatabaseService = require('../services/database.service');

const router = express.Router();
const db = new DatabaseService();

// Apply rate limiting to all team routes
router.use(rateLimit('api'));

// Get all teams (with pagination and filtering)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sport').optional().isString().withMessage('Sport must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Invalid status'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { page = 1, limit = 10, sport, search, status } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (sport) filters.sport = sport;
    if (status) filters.status = status;
    if (search) filters.search = search;

    const teams = await db.getTeams(filters, { limit: parseInt(limit), offset });
    const total = await db.getTeamsCount(filters);

    res.json({
      success: true,
      data: teams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch teams' });
  }
});

// Get team by ID
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid team ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const team = await db.getTeamById(id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Get team members
    const members = await db.getTeamMembers(id);
    team.members = members;

    // Get team statistics
    const stats = await db.getTeamStats(id);
    team.stats = stats;

    res.json({ success: true, data: team });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch team' });
  }
});

// Create new team
router.post('/', [
  authenticateToken,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Team name must be between 2 and 100 characters'),
  body('sport').isString().withMessage('Sport is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('logo_url').optional().isURL().withMessage('Invalid logo URL'),
  body('max_members').optional().isInt({ min: 1, max: 50 }).withMessage('Max members must be between 1 and 50'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, sport, description, logo_url, max_members } = req.body;
    const userId = req.user.id;

    // Check if user already has a team for this sport
    const existingTeam = await db.getUserTeamBySport(userId, sport);
    if (existingTeam) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a team for this sport' 
      });
    }

    const teamData = {
      name,
      sport,
      description,
      logo_url,
      max_members: max_members || 20,
      created_by: userId,
      status: 'active'
    };

    const team = await db.createTeam(teamData);
    
    // Add creator as team captain
    await db.addTeamMember(team.id, userId, 'captain');

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ success: false, message: 'Failed to create team' });
  }
});

// Update team
router.put('/:id', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Team name must be between 2 and 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('logo_url').optional().isURL().withMessage('Invalid logo URL'),
  body('max_members').optional().isInt({ min: 1, max: 50 }).withMessage('Max members must be between 1 and 50'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Check if user is team captain or admin
    const team = await db.getTeamById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const member = await db.getTeamMember(id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const updatedTeam = await db.updateTeam(id, updateData);
    res.json({ success: true, data: updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ success: false, message: 'Failed to update team' });
  }
});

// Delete team
router.delete('/:id', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is team captain or admin
    const team = await db.getTeamById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const member = await db.getTeamMember(id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    await db.deleteTeam(id);
    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ success: false, message: 'Failed to delete team' });
  }
});

// Team member management
router.post('/:id/members', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  body('user_id').isUUID().withMessage('Invalid user ID'),
  body('role').optional().isIn(['member', 'captain', 'coach']).withMessage('Invalid role'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role = 'member' } = req.body;
    const userId = req.user.id;

    // Check if user is team captain or admin
    const member = await db.getTeamMember(id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    // Check if team is full
    const team = await db.getTeamById(id);
    const currentMembers = await db.getTeamMembers(id);
    if (currentMembers.length >= team.max_members) {
      return res.status(400).json({ success: false, message: 'Team is full' });
    }

    // Check if user is already a member
    const existingMember = await db.getTeamMember(id, user_id);
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'User is already a team member' });
    }

    await db.addTeamMember(id, user_id, role);
    res.status(201).json({ success: true, message: 'Member added successfully' });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ success: false, message: 'Failed to add team member' });
  }
});

// Remove team member
router.delete('/:id/members/:user_id', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  param('user_id').isUUID().withMessage('Invalid user ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id, user_id } = req.params;
    const userId = req.user.id;

    // Check if user is team captain or admin
    const member = await db.getTeamMember(id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    // Prevent removing the last captain
    if (user_id !== userId) {
      const targetMember = await db.getTeamMember(id, user_id);
      if (targetMember?.role === 'captain') {
        const captains = await db.getTeamMembersByRole(id, 'captain');
        if (captains.length <= 1) {
          return res.status(400).json({ success: false, message: 'Cannot remove the last captain' });
        }
      }
    }

    await db.removeTeamMember(id, user_id);
    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ success: false, message: 'Failed to remove team member' });
  }
});

// Update team member role
router.patch('/:id/members/:user_id', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  param('user_id').isUUID().withMessage('Invalid user ID'),
  body('role').isIn(['member', 'captain', 'coach']).withMessage('Invalid role'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id, user_id } = req.params;
    const { role } = req.body;
    const userId = req.user.id;

    // Check if user is team captain or admin
    const member = await db.getTeamMember(id, userId);
    if (!member || (member.role !== 'captain' && !req.user.is_admin)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    await db.updateTeamMemberRole(id, user_id, role);
    res.json({ success: true, message: 'Member role updated successfully' });
  } catch (error) {
    console.error('Error updating team member role:', error);
    res.status(500).json({ success: false, message: 'Failed to update member role' });
  }
});

// Get team matches
router.get('/:id/matches', [
  param('id').isUUID().withMessage('Invalid team ID'),
  query('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const filters = { team_id: id };
    if (status) filters.status = status;

    const matches = await db.getTeamMatches(filters, { limit: parseInt(limit), offset });
    const total = await db.getTeamMatchesCount(filters);

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
    console.error('Error fetching team matches:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch team matches' });
  }
});

// Get team analytics
router.get('/:id/analytics', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  query('period').optional().isIn(['week', 'month', 'year', 'all']).withMessage('Invalid period'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { period = 'month' } = req.query;
    const userId = req.user.id;

    // Check if user is team member
    const member = await db.getTeamMember(id, userId);
    if (!member && !req.user.is_admin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const analytics = await db.getTeamAnalytics(id, period);
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Error fetching team analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch team analytics' });
  }
});

// Join team request
router.post('/:id/join-request', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  body('message').optional().isLength({ max: 200 }).withMessage('Message must be less than 200 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Check if team exists and is active
    const team = await db.getTeamById(id);
    if (!team || team.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Team not found or inactive' });
    }

    // Check if user is already a member
    const existingMember = await db.getTeamMember(id, userId);
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'You are already a team member' });
    }

    // Check if user already has a pending request
    const existingRequest = await db.getJoinRequest(id, userId);
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending request' });
    }

    await db.createJoinRequest(id, userId, message);
    res.status(201).json({ success: true, message: 'Join request sent successfully' });
  } catch (error) {
    console.error('Error sending join request:', error);
    res.status(500).json({ success: false, message: 'Failed to send join request' });
  }
});

// Get join requests (team captains only)
router.get('/:id/join-requests', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is team captain
    const member = await db.getTeamMember(id, userId);
    if (!member || member.role !== 'captain') {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const requests = await db.getJoinRequests(id);
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching join requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch join requests' });
  }
});

// Respond to join request
router.patch('/:id/join-requests/:request_id', [
  authenticateToken,
  param('id').isUUID().withMessage('Invalid team ID'),
  param('request_id').isUUID().withMessage('Invalid request ID'),
  body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id, request_id } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    // Check if user is team captain
    const member = await db.getTeamMember(id, userId);
    if (!member || member.role !== 'captain') {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    await db.respondToJoinRequest(request_id, action, userId);
    res.json({ success: true, message: `Request ${action}d successfully` });
  } catch (error) {
    console.error('Error responding to join request:', error);
    res.status(500).json({ success: false, message: 'Failed to respond to request' });
  }
});

module.exports = router; 