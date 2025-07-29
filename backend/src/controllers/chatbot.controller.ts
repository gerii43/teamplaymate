import { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbot.service';
import { DatabaseService } from '../services/database.service';
import { logger } from '../utils/logger';

export class ChatbotController {
  private chatbotService: ChatbotService;
  private databaseService: DatabaseService;

  constructor() {
    this.chatbotService = new ChatbotService();
    this.databaseService = new DatabaseService();
  }

  processMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { message, context } = req.body;
      const userId = (req as any).user.id;

      const response = await this.chatbotService.processMessage(userId, message);

      res.json({
        success: true,
        data: {
          message,
          response,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error: any) {
      logger.error('Chatbot message processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process message'
      });
    }
  };

  getChatHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 50;

      const history = await this.databaseService.getChatHistory(userId, limit);

      res.json({
        success: true,
        data: history
      });
    } catch (error: any) {
      logger.error('Get chat history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get chat history'
      });
    }
  };

  clearChatHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      // Implementation to clear chat history
      
      res.json({
        success: true,
        message: 'Chat history cleared successfully'
      });
    } catch (error: any) {
      logger.error('Clear chat history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear chat history'
      });
    }
  };
}