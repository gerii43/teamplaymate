import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Placeholder routes - will be implemented later
router.get('/', authenticateToken, (req, res) => {
  res.json({ message: 'Payment routes placeholder' });
});

export default router; 