import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { config } from '../config/config';
import { logger } from '../utils/logger';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: any;
  logout?: (callback: (err: any) => void) => void;
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      const user = await this.authService.register({
        email,
        password,
        name,
        provider: 'email'
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user }
      });
    } catch (error: any) {
      logger.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const { user, token } = await this.authService.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: { user, token }
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  };

  googleCallback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = req.user as any;
      
      if (!user) {
        res.redirect(`${config.cors.origin}/signin?error=oauth_failed`);
        return;
      }

      // Generate token
      const token = require('jsonwebtoken').sign(
        { userId: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Redirect based on sport selection status
      if (user.sportSelected) {
        res.redirect(`${config.cors.origin}/dashboard?token=${token}`);
      } else {
        res.redirect(`${config.cors.origin}/sport-selection?token=${token}`);
      }
    } catch (error: any) {
      logger.error('Google callback error:', error);
      res.redirect(`${config.cors.origin}/signin?error=oauth_failed`);
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;
      
      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
        return;
      }

      const user = await this.authService.verifyEmail(token as string);

      res.json({
        success: true,
        message: 'Email verified successfully',
        data: { user }
      });
    } catch (error: any) {
      logger.error('Email verification error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Email verification failed'
      });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      
      // Implementation for password reset
      // This would generate a reset token and send email
      
      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error: any) {
      logger.error('Forgot password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Password reset failed'
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;
      
      // Implementation for password reset
      
      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error: any) {
      logger.error('Reset password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Password reset failed'
      });
    }
  };

  updateSportPreference = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sport } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const user = await this.authService.updateSportPreference(userId, sport);

      res.json({
        success: true,
        message: 'Sport preference updated',
        data: { user }
      });
    } catch (error: any) {
      logger.error('Update sport preference error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update sport preference'
      });
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (req.logout) {
        req.logout((err) => {
          if (err) {
            logger.error('Logout error:', err);
            res.status(500).json({
              success: false,
              message: 'Logout failed'
            });
            return;
          }
          
          res.json({
            success: true,
            message: 'Logout successful'
          });
        });
      } else {
        res.json({
          success: true,
          message: 'Logout successful'
        });
      }
    } catch (error: any) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      const { user, token } = await this.authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: { user, token }
      });
    } catch (error: any) {
      logger.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed'
      });
    }
  };
}