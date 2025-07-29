import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

// Import services and routes
import { initEmailService } from './services/enhancedEmailService.js';
import enhancedSocketService from './services/enhancedSocketService.js';
import aiService from './services/enhancedAiService.js';

// Import routes
import enhancedAuthRoutes from './routes/enhancedAuth.js';
import enhancedFeedbackRoutes from './routes/enhancedFeedback.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize services with error handling
async function initializeServices() {
  try {
    console.log('🚀 Initializing services...');
    
    // Initialize email service
    await initEmailService();
    console.log('✅ Email service initialized');
    
    // Initialize socket service
    enhancedSocketService.init(server);
    console.log('✅ Socket service initialized');
    
    // Clear AI cache periodically
    setInterval(() => {
      aiService.clearCache();
    }, 30 * 60 * 1000); // Every 30 minutes
    
    console.log('✅ All services initialized successfully');
    
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    process.exit(1);
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com", "wss:", "ws:"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'statsor-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const socketStats = enhancedSocketService.getStats();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      email: 'active',
      socket: 'active',
      ai: 'active'
    },
    connections: socketStats
  });
});

// API Routes
app.use('/api/auth', enhancedAuthRoutes);
app.use('/api/feedback', enhancedFeedbackRoutes);

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, message, context } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'userId and message are required'
      });
    }

    const response = await aiService.chat(userId, message, context);
    
    res.json({
      success: true,
      data: {
        response: response,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Chat processing failed'
    });
  }
});

// Match endpoints
app.post('/api/matches', async (req, res) => {
  try {
    const { userId, matchData } = req.body;
    
    if (!userId || !matchData) {
      return res.status(400).json({
        success: false,
        error: 'userId and matchData are required'
      });
    }

    const matchId = `match-${Date.now()}`;
    
    // Save match to database (implement based on your schema)
    const { data, error } = await supabase
      .from('matches')
      .insert({
        id: matchId,
        ...matchData,
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Broadcast to connected users
    enhancedSocketService.broadcastMatchUpdate(matchId, {
      type: 'match-created',
      data: data
    });

    res.json({
      success: true,
      data: {
        matchId: matchId,
        match: data
      }
    });
    
  } catch (error) {
    console.error('❌ Match creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Match creation failed'
    });
  }
});

// File upload endpoint (basic implementation)
app.post('/api/upload', async (req, res) => {
  try {
    // Implement file upload logic here
    res.json({
      success: true,
      message: 'File upload endpoint - implement based on your needs'
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeServices();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

export default app;