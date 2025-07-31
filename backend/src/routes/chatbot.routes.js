const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware.ts');
const { chatLimiter } = require('../middleware/rateLimit.middleware.ts');
const { validateChatMessage } = require('../middleware/validation.middleware.ts');
const aiService = require('../services/enhancedAiService.js');
const { supabase } = require('../config/supabase.js');

const router = express.Router();

// Apply rate limiting to all chatbot routes
router.use(chatLimiter);

// Main chat endpoint
router.post('/chat', authenticateToken, validateChatMessage, async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    const userId = req.user.id;

    console.log(`💬 Chat request from ${req.user.name}: "${message}"`);

    // Get AI response
    const response = await aiService.chat(userId, message, context);

    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString(),
      user: {
        id: req.user.id,
        name: req.user.name
      }
    });

  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Chat processing failed',
      message: 'Sorry, I\'m having trouble processing your request right now. Please try again in a moment!'
    });
  }
});

// Get user-specific suggestions
router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const suggestions = await aiService.generateSuggestions(userId);

    res.json({
      success: true,
      suggestions: suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
});

// Get user's data summary
router.get('/user-data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userContext = await aiService.analyzeUserData(userId);

    // Format data for frontend
    const dataSummary = {
      user: {
        name: userContext.user?.name || 'User',
        sport: userContext.user?.sport_preference || 'Unknown',
        email: userContext.user?.email || ''
      },
      teams: userContext.teams?.map(team => ({
        id: team.id,
        name: team.name,
        playerCount: team.players?.length || 0
      })) || [],
      recentMatches: userContext.recentMatches?.slice(0, 5).map(match => ({
        id: match.id,
        homeTeam: match.home_team?.name || 'Unknown',
        awayTeam: match.away_team?.name || 'Unknown',
        homeScore: match.home_score,
        awayScore: match.away_score,
        date: match.date,
        status: match.status
      })) || [],
      todayAttendance: {
        present: userContext.todayAttendance?.length || 0,
        total: userContext.teams?.flatMap(t => t.players || []).length || 0
      },
      upcomingEvents: userContext.upcomingEvents?.slice(0, 3).map(event => ({
        id: event.id,
        title: `${event.home_team?.name || 'Home'} vs ${event.away_team?.name || 'Away'}`,
        date: event.date,
        venue: event.venue
      })) || []
    };

    res.json({
      success: true,
      data: dataSummary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ User data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user data'
    });
  }
});

// Search internet for information
router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const searchResults = await aiService.searchInternet(query);

    res.json({
      success: true,
      results: searchResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Get chat history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      messages: messages || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chat history'
    });
  }
});

// Clear chat history
router.delete('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Chat history cleared successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Clear history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear chat history'
    });
  }
});

// Get chatbot status and capabilities
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'active',
    capabilities: [
      'chat',
      'user_data_analysis',
      'suggestions',
      'internet_search',
      'match_analysis',
      'team_management'
    ],
    features: {
      human_like: true,
      context_aware: true,
      data_integration: true,
      real_time: true
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 