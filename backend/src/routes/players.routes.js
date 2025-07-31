const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { rateLimit } = require('../middleware/rateLimit.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

// Import services
const PlayerService = require('../services/player.service');
const playerService = new PlayerService();

// Validation rules
const playerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('position').isIn(['goalkeeper', 'defender', 'midfielder', 'forward']).withMessage('Invalid position'),
  body('number').optional().isInt({ min: 1, max: 99 }).withMessage('Number must be between 1 and 99'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('height').optional().isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
  body('weight').optional().isFloat({ min: 30, max: 150 }).withMessage('Weight must be between 30 and 150 kg')
];

// GET /api/players - List all players for the authenticated user
router.get('/', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { page = 1, limit = 20, teamId, position, search } = req.query;
    const userId = req.user.id;

    const players = await playerService.getPlayers(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      teamId,
      position,
      search
    });

    res.json({
      success: true,
      data: players,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: players.length
      }
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch players',
      error: error.message
    });
  }
});

// GET /api/players/:id - Get player details
router.get('/:id', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const player = await playerService.getPlayerById(id, userId);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player',
      error: error.message
    });
  }
});

// POST /api/players - Add new player
router.post('/', authenticateToken, rateLimit, playerValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const playerData = {
      ...req.body,
      userId
    };

    const newPlayer = await playerService.createPlayer(playerData);

    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      data: newPlayer
    });
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create player',
      error: error.message
    });
  }
});

// PUT /api/players/:id - Update player
router.put('/:id', authenticateToken, rateLimit, playerValidation, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const updatedPlayer = await playerService.updatePlayer(id, userId, updateData);

    if (!updatedPlayer) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      message: 'Player updated successfully',
      data: updatedPlayer
    });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update player',
      error: error.message
    });
  }
});

// DELETE /api/players/:id - Delete player
router.delete('/:id', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await playerService.deletePlayer(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete player',
      error: error.message
    });
  }
});

// GET /api/players/:id/stats - Get player statistics
router.get('/:id/stats', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { id } = req.params;
    const { period = 'all', teamId } = req.query;
    const userId = req.user.id;

    const stats = await playerService.getPlayerStats(id, userId, { period, teamId });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player statistics',
      error: error.message
    });
  }
});

// POST /api/players/:id/photo - Upload player photo
router.post('/:id/photo', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { photoUrl } = req.body;

    const updatedPlayer = await playerService.updatePlayerPhoto(id, userId, photoUrl);

    res.json({
      success: true,
      message: 'Player photo updated successfully',
      data: updatedPlayer
    });
  } catch (error) {
    console.error('Error updating player photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update player photo',
      error: error.message
    });
  }
});

// GET /api/players/team/:teamId - Get players by team
router.get('/team/:teamId', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;
    const { position, active } = req.query;

    const players = await playerService.getPlayersByTeam(teamId, userId, {
      position,
      active: active === 'true'
    });

    res.json({
      success: true,
      data: players
    });
  } catch (error) {
    console.error('Error fetching team players:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team players',
      error: error.message
    });
  }
});

// POST /api/players/bulk - Bulk create players
router.post('/bulk', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { players, teamId } = req.body;

    if (!Array.isArray(players) || players.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Players array is required and cannot be empty'
      });
    }

    const createdPlayers = await playerService.bulkCreatePlayers(players, teamId, userId);

    res.status(201).json({
      success: true,
      message: `${createdPlayers.length} players created successfully`,
      data: createdPlayers
    });
  } catch (error) {
    console.error('Error bulk creating players:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create players',
      error: error.message
    });
  }
});

// GET /api/players/search - Search players
router.get('/search', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { q, teamId, position, limit = 10 } = req.query;
    const userId = req.user.id;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const players = await playerService.searchPlayers(q, userId, {
      teamId,
      position,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: players
    });
  } catch (error) {
    console.error('Error searching players:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search players',
      error: error.message
    });
  }
});

module.exports = router; 