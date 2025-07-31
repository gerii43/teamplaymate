import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiting
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat/API rate limiting
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 chat requests per minute
  message: {
    success: false,
    error: 'Too many chat requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiting
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    error: 'Too many file uploads, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Feedback rate limiting
export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 feedback submissions per hour
  message: {
    success: false,
    error: 'Too many feedback submissions, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Match creation rate limiting
export const matchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 match creations per hour
  message: {
    success: false,
    error: 'Too many match creations, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dynamic rate limiter based on user role
export const createRoleBasedLimiter = (role: string) => {
  const limits = {
    admin: 1000,
    premium: 500,
    user: 100,
    guest: 50
  };

  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: limits[role as keyof typeof limits] || 100,
    message: {
      success: false,
      error: 'Rate limit exceeded for your account type.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
};

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});