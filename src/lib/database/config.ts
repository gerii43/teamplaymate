import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Pool } from 'pg';

// Database Configuration
export const DATABASE_CONFIG = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL || 'https://demo.supabase.co',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || 'demo-key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-key'
  },
  firebase: {
    apiKey: process.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: process.env.VITE_FIREBASE_APP_ID || 'demo-app-id'
  },
  postgresql: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'statsor_db',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  sap: {
    serverUrl: process.env.SAP_SERVER_URL || 'https://demo-sap-server.com',
    applicationId: process.env.SAP_APPLICATION_ID || 'com.statsor.mobile',
    clientId: process.env.SAP_CLIENT_ID || 'demo-client-id',
    clientSecret: process.env.SAP_CLIENT_SECRET || 'demo-client-secret'
  }
};

// Initialize Database Connections
export const supabase = createClient(
  DATABASE_CONFIG.supabase.url,
  DATABASE_CONFIG.supabase.anonKey
);

export const firebaseApp = initializeApp(DATABASE_CONFIG.firebase);
export const firestore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);

export const postgresPool = new Pool(DATABASE_CONFIG.postgresql);

// SQLite Configuration for offline storage
export const SQLITE_CONFIG = {
  dbName: 'statsor_offline.db',
  version: 1,
  tables: {
    users: 'users',
    teams: 'teams',
    players: 'players',
    matches: 'matches',
    statistics: 'statistics',
    sync_queue: 'sync_queue',
    conflict_resolution: 'conflict_resolution'
  }
};

// Sync Configuration
export const SYNC_CONFIG = {
  batchSize: 100,
  retryAttempts: 3,
  retryDelay: 1000,
  conflictResolutionStrategy: 'last_write_wins', // 'last_write_wins' | 'manual' | 'merge'
  syncInterval: 30000, // 30 seconds
  offlineQueueLimit: 1000
};

// Security Configuration
export const SECURITY_CONFIG = {
  encryption: {
    algorithm: 'AES-256-GCM',
    keyLength: 32,
    ivLength: 16
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'demo-jwt-secret',
    expiresIn: '24h'
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};