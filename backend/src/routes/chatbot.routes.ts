import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbot.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const chatbotController = new ChatbotController();

// Send message to chatbot
router.post('/message',
  [
    body('message').trim().isLength({ min: 1, max: 1000 }),
    body('context').optional().isObject()
  ],
  validateRequest,
  chatbotController.processMessage
);

// Get chat history
router.get('/history',
  chatbotController.getChatHistory
);

// Clear chat history
router.delete('/history',
  chatbotController.clearChatHistory
);

export default router;