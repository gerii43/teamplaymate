import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';
import { config } from '../config/config';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    sport?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, sport_preference')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token or user not found'
      });
    }

    // Add user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      sport: user.sport_preference
    };

    next();
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, name, sport_preference')
        .eq('id', decoded.userId)
        .single();

      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          sport: user.sport_preference
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export const requireSport = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.sport) {
    return res.status(400).json({
      success: false,
      error: 'Sport preference required'
    });
  }
  next();
};

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Check if user is admin
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('❌ Admin check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authorization check failed'
    });
  }
};

export const authMiddleware = authenticateToken;