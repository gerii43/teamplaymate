import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { handleFeedback } from '../services/enhancedEmailService.js';
import aiService from '../services/enhancedAiService.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Rate limiting for feedback endpoints
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 feedback submissions per windowMs
  message: { error: 'Too many feedback submissions, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
router.use(feedbackLimiter);

// Submit feedback with comprehensive error handling
router.post('/', [
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['bug', 'feature', 'general', 'support', 'ui', 'performance'])
    .withMessage('Invalid category'),
  body('userId')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID'),
  body('userEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email address'),
  body('userName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { 
      userId, 
      message, 
      category = 'general', 
      userEmail, 
      userName,
      rating,
      userAgent,
      currentPage
    } = req.body;

    // Validate that we have either userId or userEmail
    if (!userId && !userEmail) {
      return res.status(400).json({
        success: false,
        error: 'Either userId or userEmail is required'
      });
    }

    // Get user data if userId provided
    let userData = null;
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, name')
          .eq('id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        userData = data;
      } catch (dbError) {
        console.warn('⚠️ Could not fetch user data:', dbError);
      }
    }

    // Use provided data or fallback to database data
    const finalUserEmail = userEmail || userData?.email;
    const finalUserName = userName || userData?.name || 'Anonymous';

    if (!finalUserEmail) {
      return res.status(400).json({
        success: false,
        error: 'User email is required for feedback processing'
      });
    }

    // Analyze sentiment for priority handling
    let sentiment = { score: 0, label: 'neutral', confidence: 0 };
    try {
      sentiment = await aiService.analyzeSentiment(message);
    } catch (sentimentError) {
      console.warn('⚠️ Sentiment analysis failed:', sentimentError);
    }

    // Determine priority based on sentiment and category
    let priority = 'normal';
    if (sentiment.score < -0.5 || category === 'bug') {
      priority = 'high';
    } else if (category === 'support' || rating <= 2) {
      priority = 'medium';
    }

    // Process feedback through email service
    const emailResult = await handleFeedback({
      userId: userId || 'anonymous',
      message: message,
      category: category,
      userEmail: finalUserEmail,
      userName: finalUserName
    });

    // Store feedback in database for analytics
    try {
      const { data: feedbackRecord, error: dbError } = await supabase
        .from('feedback')
        .insert({
          user_id: userId,
          name: finalUserName,
          email: finalUserEmail,
          category: category,
          message: message,
          rating: rating,
          sentiment_score: sentiment.score,
          sentiment_label: sentiment.label,
          priority: priority,
          user_agent: userAgent,
          current_page: currentPage,
          ip_address: req.ip,
          status: 'open',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database insert error:', dbError);
        // Don't fail the request if database insert fails
      } else {
        console.log('✅ Feedback stored in database:', feedbackRecord.id);
      }
    } catch (dbError) {
      console.error('❌ Database operation failed:', dbError);
      // Continue processing even if database fails
    }

    // Log successful feedback processing
    console.log(`✅ Feedback processed successfully:`, {
      userId: userId || 'anonymous',
      email: finalUserEmail,
      category: category,
      priority: priority,
      sentiment: sentiment.label
    });

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        priority: priority,
        sentiment: sentiment.label,
        estimatedResponse: emailResult.estimatedResponse,
        category: category
      }
    });

  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    
    // Log error details for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    res.status(500).json({
      success: false,
      error: 'Feedback submission failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get feedback statistics (admin endpoint)
router.get('/stats', async (req, res) => {
  try {
    // This would typically require admin authentication
    const { data: stats, error } = await supabase
      .from('feedback')
      .select('category, priority, sentiment_label, rating, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Process statistics
    const categoryStats = {};
    const priorityStats = {};
    const sentimentStats = {};
    let totalRating = 0;
    let ratingCount = 0;

    stats.forEach(item => {
      // Category stats
      categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
      
      // Priority stats
      priorityStats[item.priority] = (priorityStats[item.priority] || 0) + 1;
      
      // Sentiment stats
      sentimentStats[item.sentiment_label] = (sentimentStats[item.sentiment_label] || 0) + 1;
      
      // Rating stats
      if (item.rating) {
        totalRating += item.rating;
        ratingCount++;
      }
    });

    const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        total: stats.length,
        categoryBreakdown: categoryStats,
        priorityBreakdown: priorityStats,
        sentimentBreakdown: sentimentStats,
        averageRating: parseFloat(averageRating),
        totalRatings: ratingCount
      }
    });

  } catch (error) {
    console.error('❌ Feedback stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve feedback statistics'
    });
  }
});

// Newsletter subscription endpoint
router.post('/newsletter', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address required'),
  body('language')
    .optional()
    .isIn(['en', 'es'])
    .withMessage('Language must be en or es')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, language = 'es' } = req.body;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('id, subscribed')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.subscribed) {
        return res.status(200).json({
          success: true,
          message: 'Already subscribed to newsletter'
        });
      } else {
        // Reactivate subscription
        await supabase
          .from('newsletter_subscriptions')
          .update({ 
            subscribed: true, 
            language: language,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);
      }
    } else {
      // Create new subscription
      await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: email,
          language: language,
          subscribed: true,
          created_at: new Date().toISOString()
        });
    }

    console.log(`✅ Newsletter subscription: ${email} (${language})`);

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Newsletter subscription failed'
    });
  }
});

export default router;