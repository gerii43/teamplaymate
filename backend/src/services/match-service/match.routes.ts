import { Router } from 'express';
import { MatchController } from './match.controller';
import { validate } from '../../shared/middleware/validation.middleware';
import { matchSchemas } from '../../shared/middleware/validation.middleware';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const matchController = new MatchController();

// Get all matches
router.get('/', 
  validate({ query: { page: 'number', limit: 'number' } }),
  matchController.getMatches
);

// Get match by ID
router.get('/:id', 
  validate({ params: { id: 'string' } }),
  matchController.getMatchById
);

// Create new match
router.post('/', 
  validate({ body: matchSchemas.createMatch }),
  authMiddleware.authorize(['match.write'], ['coach', 'admin']),
  matchController.createMatch
);

// Update match
router.put('/:id', 
  validate({ 
    params: { id: 'string' },
    body: matchSchemas.updateMatch 
  }),
  authMiddleware.authorize(['match.write'], ['coach', 'admin']),
  matchController.updateMatch
);

// Delete match
router.delete('/:id', 
  validate({ params: { id: 'string' } }),
  authMiddleware.authorize(['match.delete'], ['admin']),
  matchController.deleteMatch
);

// Add match event
router.post('/:id/events', 
  validate({ 
    params: { id: 'string' },
    body: {
      type: 'string',
      player_id: 'string',
      minute: 'number',
      description: 'string'
    }
  }),
  authMiddleware.authorize(['match.write'], ['coach', 'admin']),
  matchController.addMatchEvent
);

// Get match statistics
router.get('/:id/statistics', 
  validate({ params: { id: 'string' } }),
  matchController.getMatchStatistics
);

// Add match notes
router.post('/:id/notes',
  validate({
    params: { id: 'string' },
    body: {
      minute: 'number',
      title: 'string',
      content: 'string',
      category: 'string'
    }
  }),
  authMiddleware.authorize(['match.write'], ['coach', 'admin']),
  matchController.addMatchNote
);

// Get match notes
router.get('/:id/notes',
  validate({ params: { id: 'string' } }),
  matchController.getMatchNotes
);

// Start live match
router.post('/:id/start',
  validate({ params: { id: 'string' } }),
  authMiddleware.authorize(['match.write'], ['coach', 'admin']),
  matchController.startMatch
);

// End live match
router.post('/:id/end',
  validate({ params: { id: 'string' } }),
  authMiddleware.authorize(['match.write'], ['coach', 'admin']),
  matchController.endMatch
);

export { router as matchRoutes };