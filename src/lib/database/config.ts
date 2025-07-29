import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Database Configuration
export const DATABASE_CONFIG = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key',
    serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-key'
  },
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id'
  },
  sap: {
    serverUrl: import.meta.env.SAP_SERVER_URL || 'https://demo-sap-server.com',
    applicationId: import.meta.env.SAP_APPLICATION_ID || 'com.statsor.mobile',
    clientId: import.meta.env.SAP_CLIENT_ID || 'demo-client-id',
    clientSecret: import.meta.env.SAP_CLIENT_SECRET || 'demo-client-secret'
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
    secret: import.meta.env.JWT_SECRET || 'demo-jwt-secret',
    expiresIn: '24h'
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};