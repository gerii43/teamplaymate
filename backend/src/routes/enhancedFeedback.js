import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { sendFeedbackConfirmation } from '../services/enhancedEmailService.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Rate limiting for feedback endpoints
const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 feedback submissions per hour
  message: { error: 'Too many feedback submissions, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to feedback routes
router.use(feedbackLimiter);

// Submit feedback
router.post('/submit', [
  body('message').isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('category').isIn(['bug', 'feature', 'general', 'support']).withMessage('Invalid category'),
  body('userId').optional().isUUID().withMessage('Valid user ID required'),
  body('userEmail').optional().isEmail().withMessage('Valid email required'),
  body('userName').optional().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters')
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

    const { message, category, userId, userEmail, userName } = req.body;
    
    // Save feedback to database
    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        user_email: userEmail,
        user_name: userName,
        message: message,
        category: category,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email if email provided
    if (userEmail) {
      try {
        await sendFeedbackConfirmation(userEmail, {
          name: userName || 'User',
          message: message,
          category: category,
          feedbackId: feedback.id
        });
        console.log(`✅ Feedback confirmation email sent to ${userEmail}`);
      } catch (emailError) {
        console.warn('⚠️ Feedback confirmation email failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      feedbackId: feedback.id,
      message: 'Feedback submitted successfully'
    });
    
  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      details: error.message
    });
  }
});

// Get feedback (admin only)
router.get('/list', async (req, res) => {
  try {
    const { data: feedback, error } = await supabase
      .from('feedback')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({
      success: true,
      feedback: feedback || []
    });
    
  } catch (error) {
    console.error('❌ Get feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve feedback'
    });
  }
});

export default router;