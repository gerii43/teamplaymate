import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { UserService } from '../../services/user-service/user.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export class AuthMiddleware {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        throw new ApiError(401, 'Access token required');
      }

      const decoded = jwt.verify(token, config.auth.jwtSecret) as any;
      
      // Get user details from cache or database
      const user = await this.userService.getUserById(decoded.userId);
      
      if (!user) {
        throw new ApiError(401, 'Invalid token');
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
      };

      next();
    } catch (error) {
      logger.error('Authentication error:', error);
      
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new ApiError(401, 'Invalid token'));
      }
      
      next(error);
    }
  };

  authorize = (requiredPermissions: string[] = [], requiredRoles: string[] = []) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new ApiError(401, 'Authentication required');
        }

        // Check role-based access
        if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
          throw new ApiError(403, 'Insufficient role permissions');
        }

        // Check permission-based access
        if (requiredPermissions.length > 0) {
          const hasPermission = requiredPermissions.some(permission =>
            req.user!.permissions.includes(permission)
          );
          
          if (!hasPermission) {
            throw new ApiError(403, 'Insufficient permissions');
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      
      if (!apiKey) {
        throw new ApiError(401, 'API key required');
      }

      // Validate API key (implement your API key validation logic)
      const isValidApiKey = await this.validateApiKey(apiKey);
      
      if (!isValidApiKey) {
        throw new ApiError(401, 'Invalid API key');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return req.query.token as string || null;
  }

  private async validateApiKey(apiKey: string): Promise<boolean> {
    // Implement API key validation logic
    // This could involve checking against a database or cache
    return true; // Placeholder
  }
}

export const authMiddleware = new AuthMiddleware();