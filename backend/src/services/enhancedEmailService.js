import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email templates cache
const templates = {
  welcome: null,
  feedback: null,
  sportWelcome: null,
  verifyEmail: null,
  matchAnalysis: null,
  feedbackReceipt: null
};

// Transporter configuration with error handling
let transporter = null;

// Initialize email service with comprehensive error handling
export async function initEmailService() {
  try {
    // Create transporter with fallback configurations
    transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter connection
    await transporter.verify();
    console.log('✅ Email service initialized successfully');

    // Load all email templates
    await loadEmailTemplates();
    
    // Register Handlebars helpers
    registerHandlebarsHelpers();
    
  } catch (error) {
    console.error('❌ Email service initialization failed:', error);
    throw new Error(`Email service initialization failed: ${error.message}`);
  }
}

// Load email templates with error handling
async function loadEmailTemplates() {
  const templateDir = path.resolve(__dirname, '../templates');
  
  try {
    // Ensure templates directory exists
    await fs.mkdir(templateDir, { recursive: true });
    
    const templateFiles = {
      welcome: 'welcome.hbs',
      feedback: 'feedback.hbs',
      sportWelcome: 'sport-welcome.hbs',
      verifyEmail: 'verify-email.hbs',
      matchAnalysis: 'match-analysis.hbs',
      feedbackReceipt: 'feedback-receipt.hbs'
    };

    for (const [key, filename] of Object.entries(templateFiles)) {
      try {
        const templatePath = path.join(templateDir, filename);
        const templateContent = await fs.readFile(templatePath, 'utf8');
        templates[key] = compile(templateContent);
        console.log(`✅ Loaded template: ${filename}`);
      } catch (error) {
        console.warn(`⚠️ Template ${filename} not found, using fallback`);
        templates[key] = compile(getFallbackTemplate(key));
      }
    }
  } catch (error) {
    console.error('❌ Failed to load email templates:', error);
    // Use fallback templates
    Object.keys(templates).forEach(key => {
      templates[key] = compile(getFallbackTemplate(key));
    });
  }
}

// Register Handlebars helpers
function registerHandlebarsHelpers() {
  // Helper for conditional equality
  compile.registerHelper('if_eq', function(a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // Helper for date formatting
  compile.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleDateString();
  });

  // Helper for sport-specific content
  compile.registerHelper('sportContent', function(sport, options) {
    return options.fn({ sport: sport });
  });
}

// Send welcome email with comprehensive error handling
export async function sendWelcomeEmail(email, sport = 'soccer', userData = {}) {
  try {
    if (!email || !isValidEmail(email)) {
      throw new Error('Invalid email address provided');
    }

    if (!transporter) {
      throw new Error('Email service not initialized');
    }

    const templateData = {
      name: userData.name || 'Coach',
      sport: sport,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@statsor.com',
      appUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
      year: new Date().getFullYear(),
      ...userData
    };

    const html = templates.sportWelcome(templateData);
    
    const mailOptions = {
      from: `"Statsor Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to Statsor - Your ${sport} Management Platform!`,
      html: html,
      text: generateTextVersion(templateData, sport)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email} for ${sport}`);
    
    return {
      success: true,
      messageId: result.messageId,
      sport: sport
    };

  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    
    // Log to monitoring service (if available)
    await logEmailError('welcome', email, error);
    
    throw new Error(`Welcome email failed: ${error.message}`);
  }
}

// Handle feedback with sentiment analysis and error handling
export async function handleFeedback({ userId, message, category = 'general', userEmail, userName }) {
  try {
    if (!message || message.trim().length === 0) {
      throw new Error('Feedback message cannot be empty');
    }

    if (!userId && !userEmail) {
      throw new Error('User identification required');
    }

    // Analyze sentiment for priority handling
    const sentiment = await analyzeSentiment(message);
    const priority = sentiment.score < -0.5 ? 'high' : 'normal';

    const templateData = {
      user: {
        name: userName || 'User',
        email: userEmail,
        id: userId
      },
      message: message,
      category: category,
      priority: priority,
      sentiment: sentiment,
      timestamp: new Date().toISOString(),
      responseTime: priority === 'high' ? '2-4 hours' : '24-48 hours'
    };

    // Send confirmation to user
    if (userEmail) {
      const userHtml = templates.feedbackReceipt(templateData);
      
      await transporter.sendMail({
        from: `"Statsor Support" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: 'Feedback Received - Thank You!',
        html: userHtml
      });
    }

    // Forward to admin with enhanced details
    const adminHtml = templates.feedback({
      ...templateData,
      adminView: true,
      userAgent: process.env.USER_AGENT || 'Unknown',
      ipAddress: process.env.CLIENT_IP || 'Unknown'
    });

    await transporter.sendMail({
      from: `"Statsor Feedback" <${process.env.SMTP_USER}>`,
      to: process.env.FEEDBACK_EMAIL || process.env.ADMIN_EMAIL,
      subject: `${priority.toUpperCase()} Priority Feedback from ${userName || userEmail}`,
      html: adminHtml,
      replyTo: userEmail
    });

    console.log(`✅ Feedback processed for user ${userId || userEmail}`);
    
    return {
      success: true,
      priority: priority,
      sentiment: sentiment.label,
      estimatedResponse: templateData.responseTime
    };

  } catch (error) {
    console.error('❌ Failed to handle feedback:', error);
    await logEmailError('feedback', userEmail, error);
    throw new Error(`Feedback processing failed: ${error.message}`);
  }
}

// Send match analysis report
export async function sendMatchAnalysisReport(userEmail, matchData, insights) {
  try {
    if (!userEmail || !matchData) {
      throw new Error('Email and match data required');
    }

    const templateData = {
      match: matchData,
      insights: insights,
      generatedAt: new Date().toISOString(),
      appUrl: process.env.FRONTEND_URL
    };

    const html = templates.matchAnalysis(templateData);
    
    await transporter.sendMail({
      from: `"Statsor Analytics" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Match Analysis Report - ${matchData.homeTeam} vs ${matchData.awayTeam}`,
      html: html,
      attachments: insights.charts ? [{
        filename: 'match-stats.png',
        content: insights.charts,
        encoding: 'base64'
      }] : []
    });

    console.log(`✅ Match analysis sent to ${userEmail}`);
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send match analysis:', error);
    await logEmailError('match_analysis', userEmail, error);
    throw new Error(`Match analysis email failed: ${error.message}`);
  }
}

// Send email verification
export async function sendVerificationEmail(email, verificationToken, userName) {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const templateData = {
      name: userName,
      verificationLink: verificationLink,
      appUrl: process.env.FRONTEND_URL,
      expiresIn: '24 hours'
    };

    const html = templates.verifyEmail(templateData);
    
    await transporter.sendMail({
      from: `"Statsor Verification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email - Statsor',
      html: html
    });

    console.log(`✅ Verification email sent to ${email}`);
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    await logEmailError('verification', email, error);
    throw new Error(`Verification email failed: ${error.message}`);
  }
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function analyzeSentiment(text) {
  try {
    // Simple sentiment analysis (can be replaced with AI service)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'broken'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    const score = (positiveCount - negativeCount) / words.length;
    
    return {
      score: score,
      label: score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral',
      confidence: Math.abs(score)
    };
  } catch (error) {
    console.warn('Sentiment analysis failed, using neutral:', error);
    return { score: 0, label: 'neutral', confidence: 0 };
  }
}

function generateTextVersion(data, sport) {
  return `
Welcome to Statsor!

Hello ${data.name},

Welcome to Statsor - your ultimate ${sport} management platform!

${sport === 'soccer' ? 
  'Get ready to manage your soccer team like a pro!' : 
  'Take your futsal team to the next level!'
}

Start by creating your first match: ${data.appUrl}/dashboard

If you need help, contact us at: ${data.supportEmail}

Best regards,
The Statsor Team
  `.trim();
}

async function logEmailError(type, email, error) {
  try {
    // Log to file or monitoring service
    const errorLog = {
      timestamp: new Date().toISOString(),
      type: type,
      email: email,
      error: error.message,
      stack: error.stack
    };
    
    console.error('Email Error Log:', errorLog);
    
    // Could save to database or external logging service
    // await saveToErrorLog(errorLog);
    
  } catch (logError) {
    console.error('Failed to log email error:', logError);
  }
}

function getFallbackTemplate(type) {
  const fallbacks = {
    welcome: `
      <h1>Welcome to Statsor!</h1>
      <p>Hello {{name}},</p>
      <p>Welcome to your football management platform!</p>
      <p><a href="{{appUrl}}/dashboard">Get Started</a></p>
    `,
    sportWelcome: `
      <h1>Welcome to Statsor {{sport}}!</h1>
      <p>Hello {{name}},</p>
      <p>Welcome to Statsor - your ultimate {{sport}} management platform!</p>
      {{#if_eq sport "soccer"}}
        <p>Get ready to manage your soccer team like a pro!</p>
      {{else}}
        <p>Take your futsal team to the next level!</p>
      {{/if_eq}}
      <p><a href="{{appUrl}}/dashboard">Go to Dashboard</a></p>
    `,
    feedback: `
      <h2>New Feedback Received</h2>
      <p><strong>From:</strong> {{user.name}} ({{user.email}})</p>
      <p><strong>Category:</strong> {{category}}</p>
      <p><strong>Priority:</strong> {{priority}}</p>
      <p><strong>Message:</strong></p>
      <blockquote>{{message}}</blockquote>
      <p><strong>Sentiment:</strong> {{sentiment.label}} ({{sentiment.score}})</p>
    `,
    feedbackReceipt: `
      <h1>Thank You for Your Feedback!</h1>
      <p>Hello {{user.name}},</p>
      <p>We've received your feedback and will respond within {{responseTime}}.</p>
      <p><strong>Your message:</strong></p>
      <blockquote>{{message}}</blockquote>
    `,
    verifyEmail: `
      <h1>Verify Your Email</h1>
      <p>Hello {{name}},</p>
      <p>Please verify your email address by clicking the link below:</p>
      <p><a href="{{verificationLink}}">Verify Email</a></p>
      <p>This link expires in {{expiresIn}}.</p>
    `,
    matchAnalysis: `
      <h1>Match Analysis Report</h1>
      <h2>{{match.homeTeam}} vs {{match.awayTeam}}</h2>
      <p><strong>Final Score:</strong> {{match.homeScore}} - {{match.awayScore}}</p>
      <p><strong>Key Insights:</strong></p>
      <ul>
        {{#each insights.keyPoints}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    `
  };
  
  return fallbacks[type] || '<p>Email template not available</p>';
}

// Export email service status
export function getEmailServiceStatus() {
  return {
    initialized: !!transporter,
    templatesLoaded: Object.values(templates).every(t => t !== null),
    timestamp: new Date().toISOString()
  };
}

// Bulk email sending with rate limiting
export async function sendBulkEmails(emails, templateType, templateData, options = {}) {
  const results = [];
  const batchSize = options.batchSize || 10;
  const delay = options.delay || 1000; // 1 second between batches
  
  try {
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (email) => {
        try {
          const result = await sendTemplateEmail(email, templateType, templateData);
          return { email, success: true, result };
        } catch (error) {
          return { email, success: false, error: error.message };
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(r => r.value || r.reason));
      
      // Delay between batches to avoid rate limiting
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return {
      success: true,
      total: emails.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results
    };
    
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw new Error(`Bulk email failed: ${error.message}`);
  }
}

async function sendTemplateEmail(email, templateType, data) {
  if (!templates[templateType]) {
    throw new Error(`Template ${templateType} not found`);
  }
  
  const html = templates[templateType](data);
  
  return await transporter.sendMail({
    from: `"Statsor" <${process.env.SMTP_USER}>`,
    to: email,
    subject: data.subject || `Statsor ${templateType}`,
    html: html
  });
}