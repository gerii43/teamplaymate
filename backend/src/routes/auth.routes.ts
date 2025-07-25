import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const authController = new AuthController();

// Email registration
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().isLength({ min: 2 })
  ],
  validateRequest,
  authController.register
);

// Email login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validateRequest,
  authController.login
);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin?error=oauth_failed' }),
  authController.googleCallback
);

// Email verification
router.get('/verify-email',
  authController.verifyEmail
);

// Password reset
router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  validateRequest,
  authController.forgotPassword
);

router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 })
  ],
  validateRequest,
  authController.resetPassword
);

// Sport preference
router.post('/sport-preference',
  [body('sport').isIn(['soccer', 'futsal'])],
  validateRequest,
  authController.updateSportPreference
);

// Logout
router.post('/logout', authController.logout);

// Refresh token
router.post('/refresh', authController.refreshToken);

export default router;