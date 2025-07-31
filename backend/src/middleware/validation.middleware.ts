import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules
export const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

export const validateTeam = [
  body('name').trim().isLength({ min: 2 }),
  body('sport').isIn(['soccer', 'futsal']),
  handleValidationErrors
];

export const validatePlayer = [
  body('name').trim().isLength({ min: 2 }),
  body('position').optional().isString(),
  handleValidationErrors
];

export const validateMatch = [
  body('homeTeam').notEmpty(),
  body('awayTeam').notEmpty(),
  body('date').isISO8601(),
  handleValidationErrors
];

export const validateChatMessage = [
  body('message').trim().isLength({ min: 1, max: 1000 }),
  handleValidationErrors
];

export const validateFeedback = [
  body('rating').isInt({ min: 1, max: 5 }),
  body('message').optional().trim().isLength({ max: 1000 }),
  handleValidationErrors
];

export const validateFileUpload = [
  body('type').isIn(['image', 'document', 'video']),
  handleValidationErrors
];

export const validatePagination = [
  body('page').optional().isInt({ min: 1 }),
  body('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidationErrors
];

export const validateSearch = [
  body('query').trim().isLength({ min: 1, max: 100 }),
  body('filters').optional().isObject(),
  handleValidationErrors
];

export const validateRequest = handleValidationErrors;