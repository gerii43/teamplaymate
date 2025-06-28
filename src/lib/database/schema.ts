// Database Schema Definitions

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  version: number;
  sync_status: 'synced' | 'pending' | 'conflict' | 'error';
  last_sync_at?: string;
  checksum: string;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'coach' | 'analyst' | 'player';
  team_ids: string[];
  preferences: UserPreferences;
  auth_providers: AuthProvider[];
}

export interface UserPreferences {
  language: 'es' | 'en';
  theme: 'light' | 'dark';
  notifications: NotificationSettings;
  dashboard_layout: DashboardLayout;
}

export interface AuthProvider {
  provider: 'supabase' | 'firebase' | 'sap';
  provider_id: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
}

export interface Team extends BaseEntity {
  name: string;
  sport: 'football' | 'futsal';
  category: string;
  season: string;
  coach_id: string;
  players: string[];
  statistics: TeamStatistics;
  settings: TeamSettings;
}

export interface Player extends BaseEntity {
  name: string;
  number: number;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  team_id: string;
  birth_date: string;
  statistics: PlayerStatistics;
  attendance: AttendanceRecord[];
  medical_info: MedicalInfo;
}

export interface Match extends BaseEntity {
  home_team_id: string;
  away_team_id: string;
  date: string;
  venue: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  score: MatchScore;
  events: MatchEvent[];
  statistics: MatchStatistics;
  lineup: MatchLineup;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'assist' | 'foul' | 'card' | 'substitution';
  player_id: string;
  team_id: string;
  minute: number;
  description: string;
  metadata: Record<string, any>;
}

export interface SyncOperation {
  id: string;
  entity_type: string;
  entity_id: string;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, any>;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry_count: number;
  error_message?: string;
  target_databases: string[];
}

export interface ConflictResolution {
  id: string;
  entity_type: string;
  entity_id: string;
  conflict_type: 'version' | 'data' | 'delete';
  local_data: Record<string, any>;
  remote_data: Record<string, any>;
  resolution_strategy: 'local' | 'remote' | 'merge' | 'manual';
  resolved_data?: Record<string, any>;
  resolved_at?: string;
  resolved_by?: string;
}

// SQL Schema Definitions
export const SQL_SCHEMAS = {
  postgresql: {
    users: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'coach', 'analyst', 'player')),
        team_ids UUID[],
        preferences JSONB DEFAULT '{}',
        auth_providers JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        version INTEGER DEFAULT 1,
        sync_status VARCHAR(20) DEFAULT 'synced',
        last_sync_at TIMESTAMP WITH TIME ZONE,
        checksum VARCHAR(64) NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_sync_status ON users(sync_status);
    `,
    
    teams: `
      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        sport VARCHAR(50) NOT NULL CHECK (sport IN ('football', 'futsal')),
        category VARCHAR(100),
        season VARCHAR(20),
        coach_id UUID REFERENCES users(id),
        players UUID[],
        statistics JSONB DEFAULT '{}',
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        version INTEGER DEFAULT 1,
        sync_status VARCHAR(20) DEFAULT 'synced',
        last_sync_at TIMESTAMP WITH TIME ZONE,
        checksum VARCHAR(64) NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_teams_coach_id ON teams(coach_id);
      CREATE INDEX IF NOT EXISTS idx_teams_sport ON teams(sport);
    `,
    
    players: `
      CREATE TABLE IF NOT EXISTS players (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        number INTEGER NOT NULL,
        position VARCHAR(50) NOT NULL CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'forward')),
        team_id UUID REFERENCES teams(id),
        birth_date DATE,
        statistics JSONB DEFAULT '{}',
        attendance JSONB DEFAULT '[]',
        medical_info JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        version INTEGER DEFAULT 1,
        sync_status VARCHAR(20) DEFAULT 'synced',
        last_sync_at TIMESTAMP WITH TIME ZONE,
        checksum VARCHAR(64) NOT NULL,
        UNIQUE(team_id, number)
      );
      
      CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
      CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
    `,
    
    matches: `
      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        home_team_id UUID REFERENCES teams(id),
        away_team_id UUID REFERENCES teams(id),
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        venue VARCHAR(255),
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
        score JSONB DEFAULT '{}',
        events JSONB DEFAULT '[]',
        statistics JSONB DEFAULT '{}',
        lineup JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        version INTEGER DEFAULT 1,
        sync_status VARCHAR(20) DEFAULT 'synced',
        last_sync_at TIMESTAMP WITH TIME ZONE,
        checksum VARCHAR(64) NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
      CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
      CREATE INDEX IF NOT EXISTS idx_matches_teams ON matches(home_team_id, away_team_id);
    `,
    
    sync_operations: `
      CREATE TABLE IF NOT EXISTS sync_operations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        operation VARCHAR(20) NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
        data JSONB NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        retry_count INTEGER DEFAULT 0,
        error_message TEXT,
        target_databases TEXT[] DEFAULT ARRAY['supabase', 'firebase', 'postgresql']
      );
      
      CREATE INDEX IF NOT EXISTS idx_sync_operations_status ON sync_operations(status);
      CREATE INDEX IF NOT EXISTS idx_sync_operations_timestamp ON sync_operations(timestamp);
    `,
    
    conflict_resolutions: `
      CREATE TABLE IF NOT EXISTS conflict_resolutions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        conflict_type VARCHAR(20) NOT NULL CHECK (conflict_type IN ('version', 'data', 'delete')),
        local_data JSONB NOT NULL,
        remote_data JSONB NOT NULL,
        resolution_strategy VARCHAR(20) NOT NULL CHECK (resolution_strategy IN ('local', 'remote', 'merge', 'manual')),
        resolved_data JSONB,
        resolved_at TIMESTAMP WITH TIME ZONE,
        resolved_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_conflict_resolutions_entity ON conflict_resolutions(entity_type, entity_id);
    `
  },
  
  sqlite: {
    users: `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'coach', 'analyst', 'player')),
        team_ids TEXT,
        preferences TEXT DEFAULT '{}',
        auth_providers TEXT DEFAULT '[]',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        version INTEGER DEFAULT 1,
        sync_status TEXT DEFAULT 'synced',
        last_sync_at TEXT,
        checksum TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_sync_status ON users(sync_status);
    `,
    
    sync_queue: `
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
        data TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        retry_count INTEGER DEFAULT 0,
        error_message TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
    `
  }
};

// Type definitions for statistics
export interface PlayerStatistics {
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  matches_played: number;
  passes_completed: number;
  passes_attempted: number;
  shots_on_target: number;
  shots_total: number;
}

export interface TeamStatistics {
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  possession_average: number;
  pass_accuracy: number;
}

export interface MatchStatistics {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shots_on_target: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellow_cards: { home: number; away: number };
  red_cards: { home: number; away: number };
}

export interface MatchScore {
  home: number;
  away: number;
  half_time: { home: number; away: number };
}

export interface MatchLineup {
  home: {
    formation: string;
    starting_eleven: string[];
    substitutes: string[];
  };
  away: {
    formation: string;
    starting_eleven: string[];
    substitutes: string[];
  };
}

export interface AttendanceRecord {
  date: string;
  present: boolean;
  type: 'training' | 'match';
  notes?: string;
}

export interface MedicalInfo {
  injuries: Injury[];
  medical_clearance: boolean;
  emergency_contact: EmergencyContact;
}

export interface Injury {
  type: string;
  date: string;
  severity: 'minor' | 'moderate' | 'severe';
  expected_recovery: string;
  status: 'active' | 'recovering' | 'recovered';
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  match_reminders: boolean;
  training_reminders: boolean;
  injury_alerts: boolean;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  theme: string;
  layout_type: 'grid' | 'list';
}

export interface DashboardWidget {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
}

export interface TeamSettings {
  training_schedule: TrainingSchedule[];
  match_settings: MatchSettings;
  notification_preferences: NotificationSettings;
  data_retention_days: number;
}

export interface TrainingSchedule {
  day: string;
  start_time: string;
  end_time: string;
  location: string;
  type: string;
}

export interface MatchSettings {
  default_formation: string;
  substitution_limit: number;
  match_duration: number;
  half_time_duration: number;
}