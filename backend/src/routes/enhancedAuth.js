import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { sendWelcomeEmail, sendVerificationEmail } from '../services/enhancedEmailService.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
router.use(authLimiter);

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  scope: ['profile', 'email'],
  state: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth callback received for:', profile.emails[0].value);
    
    // Check if user exists
    let user = await findUserByGoogleId(profile.id);
    let isNewUser = false;
    
    if (!user) {
      // Check if user exists by email
      user = await findUserByEmail(profile.emails[0].value);
      
      if (!user) {
        // Create new user
        isNewUser = true;
        user = await createUser({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0]?.value,
          provider: 'google',
          sportPreference: null,
          isNew: true,
          emailVerified: true, // Google emails are pre-verified
          createdAt: new Date().toISOString()
        });
        
        console.log('✅ New user created:', user.email);
      } else {
        // Link Google account to existing user
        await updateUser(user.id, { googleId: profile.id });
        console.log('✅ Google account linked to existing user:', user.email);
      }
    } else {
      // Update last login
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() });
      console.log('✅ Existing user logged in:', user.email);
    }
    
    // Add metadata for callback handling
    user.isNewUser = isNewUser;
    user.needsSportSelection = !user.sportPreference;
    
    return done(null, user);
    
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    return done(error, null);
  }
}));

// Configure GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback',
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub OAuth callback received for:', profile.username);
    
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email found in GitHub profile'), null);
    }
    
    let user = await findUserByGitHubId(profile.id);
    let isNewUser = false;
    
    if (!user) {
      user = await findUserByEmail(email);
      
      if (!user) {
        isNewUser = true;
        user = await createUser({
          githubId: profile.id,
          email: email,
          name: profile.displayName || profile.username,
          picture: profile.photos[0]?.value,
          provider: 'github',
          sportPreference: null,
          isNew: true,
          emailVerified: true,
          createdAt: new Date().toISOString()
        });
        
        console.log('✅ New GitHub user created:', user.email);
      } else {
        await updateUser(user.id, { githubId: profile.id });
        console.log('✅ GitHub account linked to existing user:', user.email);
      }
    } else {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() });
      console.log('✅ Existing GitHub user logged in:', user.email);
    }
    
    user.isNewUser = isNewUser;
    user.needsSportSelection = !user.sportPreference;
    
    return done(null, user);
    
  } catch (error) {
    console.error('❌ GitHub OAuth error:', error);
    return done(error, null);
  }
}));

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
  try {
    const prompt = req.query.prompt === 'signup' ? 'select_account' : 'consent';
    const state = req.query.type || 'signin'; // 'signin' or 'signup'
    
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: prompt,
      state: state
    })(req, res, next);
  } catch (error) {
    console.error('❌ Google OAuth initiation error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=oauth_init_failed`);
  }
});

// Initiate GitHub OAuth
router.get('/github', (req, res, next) => {
  try {
    const state = req.query.type || 'signin';
    
    passport.authenticate('github', {
      scope: ['user:email'],
      state: state
    })(req, res, next);
  } catch (error) {
    console.error('❌ GitHub OAuth initiation error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=oauth_init_failed`);
  }
});

// Google callback handler
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/signin?error=oauth_failed`,
    session: false
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        throw new Error('No user data received from Google');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: req.user.id, 
          email: req.user.email,
          provider: 'google'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Determine redirect URL
      let redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
      
      if (req.user.needsSportSelection) {
        redirectUrl = `${process.env.FRONTEND_URL}/select-sport`;
      }

      // Add token to redirect URL
      redirectUrl += `?token=${token}`;

      // Send welcome email for new users
      if (req.user.isNewUser) {
        try {
          await sendWelcomeEmail(req.user.email, 'soccer', {
            name: req.user.name
          });
        } catch (emailError) {
          console.warn('⚠️ Welcome email failed, but continuing with auth:', emailError);
        }
      }

      console.log(`✅ Google OAuth successful, redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('❌ Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=callback_failed`);
    }
  }
);

// GitHub callback handler
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL}/signin?error=oauth_failed`,
    session: false
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        throw new Error('No user data received from GitHub');
      }

      const token = jwt.sign(
        { 
          userId: req.user.id, 
          email: req.user.email,
          provider: 'github'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      let redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
      
      if (req.user.needsSportSelection) {
        redirectUrl = `${process.env.FRONTEND_URL}/select-sport`;
      }

      redirectUrl += `?token=${token}`;

      if (req.user.isNewUser) {
        try {
          await sendWelcomeEmail(req.user.email, 'soccer', {
            name: req.user.name
          });
        } catch (emailError) {
          console.warn('⚠️ Welcome email failed, but continuing with auth:', emailError);
        }
      }

      console.log(`✅ GitHub OAuth successful, redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('❌ GitHub callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=callback_failed`);
    }
  }
);

// Sport selection endpoint with enhanced error handling
router.post('/select-sport', [
  body('userId').isUUID().withMessage('Valid user ID required'),
  body('sport').isIn(['soccer', 'futsal']).withMessage('Sport must be soccer or futsal')
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

    const { userId, sport } = req.body;
    
    // Update user sport preference
    const updatedUser = await updateUser(userId, {
      sportPreference: sport,
      isNew: false,
      sportSelectedAt: new Date().toISOString()
    });

    if (!updatedUser) {
      throw new Error('User not found or update failed');
    }

    // Send sport-specific welcome email
    try {
      await sendWelcomeEmail(updatedUser.email, sport, {
        name: updatedUser.name
      });
      console.log(`✅ Sport welcome email sent to ${updatedUser.email} for ${sport}`);
    } catch (emailError) {
      console.warn('⚠️ Sport welcome email failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({ 
      success: true, 
      sport: sport,
      message: `Sport preference saved: ${sport}`
    });
    
  } catch (error) {
    console.error('❌ Sport selection error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save sport preference',
      details: error.message
    });
  }
});

// Email verification endpoint
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Update user email verification status
    const updatedUser = await updateUser(decoded.userId, {
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString()
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    console.log(`✅ Email verified for user: ${updatedUser.email}`);
    
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?verified=true`);
    
  } catch (error) {
    console.error('❌ Email verification error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=verification_failed`);
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log the logout event
    console.log('✅ User logout requested');
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

// Helper functions for database operations
async function findUserByGoogleId(googleId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error finding user by Google ID:', error);
    return null;
  }
}

async function findUserByGitHubId(githubId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('github_id', githubId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error finding user by GitHub ID:', error);
    return null;
  }
}

async function findUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

async function createUser(userData) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function updateUser(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export default router;