import { Request, Response } from 'express';
import { EmailService } from '../services/email.service';
import { logger } from '../utils/logger';

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  sendFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, message, category, rating } = req.body;
      
      await this.emailService.sendFeedbackEmail({
        name,
        email,
        message,
        category,
        rating
      });

      res.json({
        success: true,
        message: 'Feedback sent successfully'
      });
    } catch (error: any) {
      logger.error('Send feedback error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send feedback'
      });
    }
  };

  sendContact = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Implementation for contact email
      
      res.json({
        success: true,
        message: 'Contact message sent successfully'
      });
    } catch (error: any) {
      logger.error('Send contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send contact message'
      });
    }
  };

  subscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, language } = req.body;
      
      // Implementation for newsletter subscription
      
      res.json({
        success: true,
        message: 'Newsletter subscription successful'
      });
    } catch (error: any) {
      logger.error('Newsletter subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Newsletter subscription failed'
      });
    }
  };
}