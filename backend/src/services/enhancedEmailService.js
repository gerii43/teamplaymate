import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EnhancedEmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.isInitialized = false;
  }

  async init() {
  try {
      // Create transporter
      this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

      // Load email templates
      await this.loadTemplates();
      
      this.isInitialized = true;
      console.log('✅ Email service initialized');
    
  } catch (error) {
    console.error('❌ Email service initialization failed:', error);
      throw error;
  }
}

  async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates');
      const templateFiles = await fs.readdir(templatesDir);
      
      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = path.basename(file, '.hbs');
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf-8');
          
          this.templates.set(templateName, handlebars.compile(templateContent));
          console.log(`✅ Loaded email template: ${templateName}`);
        }
      }
      
      } catch (error) {
      console.error('❌ Template loading failed:', error);
      // Create fallback templates
      this.createFallbackTemplates();
      }
    }

  createFallbackTemplates() {
    // Welcome template
    this.templates.set('welcome', handlebars.compile(`
      <h1>Welcome to Statsor, {{name}}!</h1>
      <p>Thank you for joining our football management platform.</p>
      <p>Your sport preference: {{sport}}</p>
      <p>Get started by creating your first team!</p>
    `));

    // Verification template
    this.templates.set('verification', handlebars.compile(`
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="{{verificationUrl}}">Verify Email</a>
    `));

    // Sport welcome template
    this.templates.set('sport-welcome', handlebars.compile(`
      <h1>Welcome to {{sport}} management!</h1>
      <p>Hi {{name}},</p>
      <p>You've selected {{sport}} as your preferred sport.</p>
      <p>Start managing your {{sport}} teams and matches today!</p>
    `));
  }

  async sendEmail(to, subject, templateName, data = {}) {
  try {
      if (!this.isInitialized) {
      throw new Error('Email service not initialized');
    }

      const template = this.templates.get(templateName);
      if (!template) {
        throw new Error(`Template '${templateName}' not found`);
      }

      const html = template(data);
    
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@statsor.com',
        to: to,
        subject: subject,
        html: html
    };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to}: ${subject}`);
      return result;

  } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
  }
}

  async sendWelcomeEmail(email, sport, data = {}) {
    return this.sendEmail(
      email,
      'Welcome to Statsor!',
      'welcome',
      { ...data, sport }
    );
  }

  async sendVerificationEmail(email, verificationUrl, data = {}) {
    return this.sendEmail(
      email,
      'Verify Your Email - Statsor',
      'verification',
      { ...data, verificationUrl }
    );
}

  async sendSportWelcomeEmail(email, sport, data = {}) {
    return this.sendEmail(
      email,
      `Welcome to ${sport} management!`,
      'sport-welcome',
      { ...data, sport }
    );
}

  async sendFeedbackConfirmation(email, feedbackData) {
    return this.sendEmail(
      email,
      'Feedback Received - Statsor',
      'feedback-confirmation',
      feedbackData
    );
  }

  async sendMatchNotification(email, matchData) {
    return this.sendEmail(
      email,
      'New Match Scheduled',
      'match-notification',
      matchData
    );
  }

  // Test email service
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
        } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
        }
  }
}

// Create and export singleton instance
const emailService = new EnhancedEmailService();

export const initEmailService = () => emailService.init();
export const sendWelcomeEmail = (email, sport, data) => emailService.sendWelcomeEmail(email, sport, data);
export const sendVerificationEmail = (email, verificationUrl, data) => emailService.sendVerificationEmail(email, verificationUrl, data);
export const sendSportWelcomeEmail = (email, sport, data) => emailService.sendSportWelcomeEmail(email, sport, data);
export const sendFeedbackConfirmation = (email, feedbackData) => emailService.sendFeedbackConfirmation(email, feedbackData);
export const sendMatchNotification = (email, matchData) => emailService.sendMatchNotification(email, matchData);
export const testEmailConnection = () => emailService.testConnection();

export default emailService;