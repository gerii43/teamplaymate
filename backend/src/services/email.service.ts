import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.secure,
      auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.pass
      }
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const template = await this.loadTemplate('welcome');
      const html = template({
        name,
        platformName: 'Statsor',
        loginUrl: `${config.cors.origin}/signin`,
        supportEmail: config.email.adminEmail
      });

      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: '¡Bienvenido a Statsor! / Welcome to Statsor!',
        html
      });

      logger.info(`Welcome email sent to: ${email}`);
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${config.cors.origin}/verify-email?token=${token}`;
      const template = await this.loadTemplate('verification');
      const html = template({
        name,
        verificationUrl,
        platformName: 'Statsor'
      });

      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: 'Verifica tu email / Verify your email - Statsor',
        html
      });

      logger.info(`Verification email sent to: ${email}`);
    } catch (error) {
      logger.error('Failed to send verification email:', error);
    }
  }

  async sendFeedbackEmail(feedback: {
    name: string;
    email: string;
    message: string;
    rating?: number;
    category: string;
  }): Promise<void> {
    try {
      const template = await this.loadTemplate('feedback');
      const html = template({
        ...feedback,
        timestamp: new Date().toISOString(),
        platformName: 'Statsor'
      });

      await this.transporter.sendMail({
        from: config.email.from,
        to: config.email.adminEmail,
        subject: `New Feedback from ${feedback.name} - Statsor`,
        html,
        replyTo: feedback.email
      });

      // Send confirmation to user
      const confirmationTemplate = await this.loadTemplate('feedback-confirmation');
      const confirmationHtml = confirmationTemplate({
        name: feedback.name,
        platformName: 'Statsor'
      });

      await this.transporter.sendMail({
        from: config.email.from,
        to: feedback.email,
        subject: 'Gracias por tu feedback / Thank you for your feedback - Statsor',
        html: confirmationHtml
      });

      logger.info(`Feedback email sent from: ${feedback.email}`);
    } catch (error) {
      logger.error('Failed to send feedback email:', error);
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${config.cors.origin}/reset-password?token=${resetToken}`;
      const template = await this.loadTemplate('password-reset');
      const html = template({
        name,
        resetUrl,
        platformName: 'Statsor'
      });

      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: 'Restablece tu contraseña / Reset your password - Statsor',
        html
      });

      logger.info(`Password reset email sent to: ${email}`);
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
    }
  }

  private async loadTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    try {
      const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      return handlebars.compile(templateSource);
    } catch (error) {
      logger.error(`Failed to load template ${templateName}:`, error);
      throw error;
    }
  }
}