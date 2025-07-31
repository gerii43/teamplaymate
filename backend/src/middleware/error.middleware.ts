import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error status
  const status = error.status || 500;
  const message = error.message || 'Internal server error';

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      code: error.code
    })
  };

  res.status(status).json(errorResponse);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: AppError = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const createError = (message: string, status: number = 500, code?: string): AppError => {
  const error: AppError = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};