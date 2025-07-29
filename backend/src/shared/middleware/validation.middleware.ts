import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        validationErrors.push(`Body: ${error.details.map(x => x.message).join(', ')}`);
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        validationErrors.push(`Query: ${error.details.map(x => x.message).join(', ')}`);
      }
    }

    // Validate route parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        validationErrors.push(`Params: ${error.details.map(x => x.message).join(', ')}`);
      }
    }

    if (validationErrors.length > 0) {
      throw new ApiError(400, `Validation Error: ${validationErrors.join('; ')}`);
    }

    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().uuid().required(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
  dateRange: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
  }),
};

// User validation schemas
export const userSchemas = {
  createUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid('admin', 'coach', 'analyst', 'player').default('player'),
  }),
  updateUser: Joi.object({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(100),
    role: Joi.string().valid('admin', 'coach', 'analyst', 'player'),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Team validation schemas
export const teamSchemas = {
  createTeam: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    sport: Joi.string().valid('football', 'futsal').required(),
    category: Joi.string().max(100),
    season: Joi.string().max(20),
    coachId: Joi.string().uuid().required(),
  }),
  updateTeam: Joi.object({
    name: Joi.string().min(2).max(100),
    sport: Joi.string().valid('football', 'futsal'),
    category: Joi.string().max(100),
    season: Joi.string().max(20),
    coachId: Joi.string().uuid(),
  }),
};

// Player validation schemas
export const playerSchemas = {
  createPlayer: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    number: Joi.number().integer().min(1).max(99).required(),
    position: Joi.string().valid('goalkeeper', 'defender', 'midfielder', 'forward').required(),
    teamId: Joi.string().uuid().required(),
    birthDate: Joi.date().required(),
  }),
  updatePlayer: Joi.object({
    name: Joi.string().min(2).max(100),
    number: Joi.number().integer().min(1).max(99),
    position: Joi.string().valid('goalkeeper', 'defender', 'midfielder', 'forward'),
    teamId: Joi.string().uuid(),
    birthDate: Joi.date(),
  }),
};

// Match validation schemas
export const matchSchemas = {
  createMatch: Joi.object({
    homeTeamId: Joi.string().uuid().required(),
    awayTeamId: Joi.string().uuid().required(),
    date: Joi.date().iso().required(),
    venue: Joi.string().max(255),
    status: Joi.string().valid('scheduled', 'live', 'finished', 'cancelled').default('scheduled'),
  }),
  updateMatch: Joi.object({
    homeTeamId: Joi.string().uuid(),
    awayTeamId: Joi.string().uuid(),
    date: Joi.date().iso(),
    venue: Joi.string().max(255),
    status: Joi.string().valid('scheduled', 'live', 'finished', 'cancelled'),
    score: Joi.object({
      home: Joi.number().integer().min(0),
      away: Joi.number().integer().min(0),
    }),
  }),
};