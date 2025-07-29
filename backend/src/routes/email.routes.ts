import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const emailController = new EmailController();

// Send feedback email
router.post('/feedback',
  [
    body('name').trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().isLength({ min: 10 }),
    body('category').isIn(['bug', 'feature', 'general', 'support']),
    body('rating').optional().isInt({ min: 1, max: 5 })
  ],
  validateRequest,
  emailController.sendFeedback
);

// Send contact email
router.post('/contact',
  [
    body('name').trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('subject').trim().isLength({ min: 5 }),
    body('message').trim().isLength({ min: 10 })
  ],
  validateRequest,
  emailController.sendContact
);

// Newsletter subscription
router.post('/newsletter',
  [
    body('email').isEmail().normalizeEmail(),
    body('language').optional().isIn(['en', 'es'])
  ],
  validateRequest,
  emailController.subscribeNewsletter
);

export default router;