import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.secure,
      auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.pass
      }
    });
  }

  async initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await this.loadTemplates();
      console.log('✅ Email service initialized');
      
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      throw error;
    }
  }

  private async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates');
      const templateFiles = await fs.readdir(templatesDir);
      
      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = path.basename(file, '.hbs');
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf-8');
          
          this.templates.set(templateName, handlebars.compile(templateContent));
        }
      }
    } catch (error) {
      console.warn('⚠️ Template loading failed, using fallbacks');
      this.createFallbackTemplates();
    }
  }

  private createFallbackTemplates() {
    this.templates.set('welcome', handlebars.compile(`
      <h1>Welcome to Statsor, {{name}}!</h1>
      <p>Thank you for joining our football management platform.</p>
      <p>Your sport preference: {{sport}}</p>
    `));

    this.templates.set('verification', handlebars.compile(`
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="{{verificationUrl}}">Verify Email</a>
    `));
  }

  async sendEmail(to: string, subject: string, templateName: string, data: any = {}) {
    try {
      if (!this.transporter) {
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

  async sendWelcomeEmail(email: string, sport: string, data: any = {}) {
    return this.sendEmail(
      email,
      'Welcome to Statsor!',
      'welcome',
      { ...data, sport }
    );
  }

  async sendVerificationEmail(email: string, verificationUrl: string, data: any = {}) {
    return this.sendEmail(
      email,
      'Verify Your Email - Statsor',
      'verification',
      { ...data, verificationUrl }
    );
  }

  async testConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('❌ Email connection test failed:', error);
      return false;
    }
  }
}

export default new EmailService();