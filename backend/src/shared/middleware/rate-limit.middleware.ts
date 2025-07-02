import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';

// General rate limiting
export const generalRateLimit = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new ApiError(429, 'Too many requests');
  },
});

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 900, // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// API rate limiting for external integrations
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'API rate limit exceeded',
    retryAfter: 60,
  },
  keyGenerator: (req) => {
    // Use API key or IP address for rate limiting
    return req.headers['x-api-key'] as string || req.ip;
  },
});

// File upload rate limiting
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads per minute
  message: {
    error: 'Too many file uploads, please try again later.',
    retryAfter: 60,
  },
});

// Premium user rate limiting (higher limits)
export const premiumRateLimit = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests * 5, // 5x higher limit
  skip: (req) => {
    // Skip rate limiting for premium users
    const user = (req as any).user;
    return user && ['premium', 'enterprise'].includes(user.plan);
  },
});