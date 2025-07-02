import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  
  // Database
  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
  
  // Authentication
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  
  // OAuth
  GOOGLE_CLIENT_ID: Joi.string(),
  GOOGLE_CLIENT_SECRET: Joi.string(),
  
  // External APIs
  FOOTBALL_API_KEY: Joi.string(),
  
  // Message Queue
  RABBITMQ_URL: Joi.string().default('amqp://localhost:5672'),
  
  // Monitoring
  SENTRY_DSN: Joi.string(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  
  // File Upload
  MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB
  UPLOAD_PATH: Joi.string().default('./uploads'),
  
  // CORS
  CORS_ORIGIN: Joi.string().default('*'),
  
  // Logging
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  
  database: {
    url: envVars.DATABASE_URL,
    redis: {
      url: envVars.REDIS_URL,
    },
    mongodb: {
      url: envVars.MONGODB_URL,
    },
  },
  
  auth: {
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_EXPIRES_IN,
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
  },
  
  externalApis: {
    footballApiKey: envVars.FOOTBALL_API_KEY,
  },
  
  messageQueue: {
    url: envVars.RABBITMQ_URL,
  },
  
  monitoring: {
    sentryDsn: envVars.SENTRY_DSN,
  },
  
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
  },
  
  upload: {
    maxFileSize: envVars.MAX_FILE_SIZE,
    uploadPath: envVars.UPLOAD_PATH,
  },
  
  cors: {
    origin: envVars.CORS_ORIGIN,
  },
  
  logging: {
    level: envVars.LOG_LEVEL,
  },
};

export default config;