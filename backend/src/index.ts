import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'redis';

// Import configurations and middleware
import { config } from './config/config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { rateLimitMiddleware } from './middleware/rateLimit.middleware';
import { authMiddleware } from './middleware/auth.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import teamRoutes from './routes/team.routes';
import playerRoutes from './routes/player.routes';
import matchRoutes from './routes/match.routes';
import analyticsRoutes from './routes/analytics.routes';
import chatbotRoutes from './routes/chatbot.routes';
import paymentRoutes from './routes/payment.routes';
import emailRoutes from './routes/email.routes';

// Import services
import { DatabaseService } from './services/database.service';
import { EmailService } from './services/email.service';
import { ChatbotService } from './services/chatbot.service';
import { SocketService } from './services/socket.service';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;
  public server: any;
  public io: Server;
  private databaseService: DatabaseService;
  private emailService: EmailService;
  private chatbotService: ChatbotService;
  private socketService: SocketService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: config.cors.origin,
        methods: ['GET', 'POST']
      }
    });

    this.initializeServices();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize database
      this.databaseService = new DatabaseService();
      await this.databaseService.initialize();

      // Initialize email service
      this.emailService = new EmailService();

      // Initialize chatbot service with Puter.js and DeepSeek
      this.chatbotService = new ChatbotService();
      await this.chatbotService.initialize();

      // Initialize socket service
      this.socketService = new SocketService(this.io);

      logger.info('All services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      process.exit(1);
    }
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          scriptSrc: ["'self'", "https://js.stripe.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: ["'self'", "https://api.stripe.com", "wss:"]
        }
      }
    }));

    // CORS
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
    }));

    // General middleware
    this.app.use(compression());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    this.app.use(morgan('combined'));

    // Session configuration for OAuth
    const redisClient = Redis.createClient({
      url: config.redis.url
    });

    this.app.use(session({
      store: new RedisStore({ client: redisClient }),
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: config.env === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Passport middleware
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Rate limiting
    this.app.use(rateLimitMiddleware);

    // File upload middleware
    this.app.use('/uploads', express.static('uploads'));
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '2.0.0'
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', authMiddleware, userRoutes);
    this.app.use('/api/teams', authMiddleware, teamRoutes);
    this.app.use('/api/players', authMiddleware, playerRoutes);
    this.app.use('/api/matches', authMiddleware, matchRoutes);
    this.app.use('/api/analytics', authMiddleware, analyticsRoutes);
    this.app.use('/api/chatbot', authMiddleware, chatbotRoutes);
    this.app.use('/api/payments', authMiddleware, paymentRoutes);
    this.app.use('/api/email', emailRoutes);

    // Serve uploaded files
    this.app.use('/uploads', express.static('uploads'));
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public listen(): void {
    const port = config.port || 3000;
    this.server.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`📊 Environment: ${config.env}`);
      logger.info(`🔗 Health check: http://localhost:${port}/health`);
    });
  }
}

// Start the application
const app = new App();
app.listen();

export default app;