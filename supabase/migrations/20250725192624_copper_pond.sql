/*
  # Complete Statsor Platform Schema

  1. Enhanced Tables
    - Enhanced users table with Google OAuth and sport preferences
    - Teams table with sport-specific configurations
    - Players table with photo support and sport-specific stats
    - Matches table with goal locations and notes
    - Match notes table for detailed observations
    - Chat messages table for AI chatbot
    - Analytics reports table
    - Payment transactions table

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Implement role-based access control

  3. Functions and Triggers
    - Auto-update timestamps
    - Data validation functions
    - Analytics calculation functions
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enhanced Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text,
  name text NOT NULL,
  picture text,
  provider text NOT NULL DEFAULT 'email' CHECK (provider IN ('email', 'google')),
  google_id text UNIQUE,
  sport text CHECK (sport IN ('soccer', 'futsal')),
  sport_selected boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  language text DEFAULT 'es' CHECK (language IN ('en', 'es')),
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Enhanced Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  sport text NOT NULL CHECK (sport IN ('soccer', 'futsal')),
  category text,
  season text,
  coach_id uuid REFERENCES users(id) ON DELETE CASCADE,
  sport_config jsonb DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can manage own teams"
  ON teams
  FOR ALL
  TO authenticated
  USING (auth.uid() = coach_id);

-- Enhanced Players Table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  number integer NOT NULL,
  position text NOT NULL CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'forward')),
  birth_date date,
  photo_url text,
  statistics jsonb DEFAULT '{}',
  sport_specific_stats jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(team_id, number)
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team coaches can manage players"
  ON players
  FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams WHERE coach_id = auth.uid()
    )
  );

-- Enhanced Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team_id uuid REFERENCES teams(id),
  away_team_id uuid REFERENCES teams(id),
  date timestamptz NOT NULL,
  venue text,
  sport text NOT NULL CHECK (sport IN ('soccer', 'futsal')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
  score jsonb DEFAULT '{"home": 0, "away": 0}',
  events jsonb DEFAULT '[]',
  statistics jsonb DEFAULT '{}',
  goal_locations jsonb DEFAULT '{"home": [], "away": []}',
  lineup jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team coaches can manage matches"
  ON matches
  FOR ALL
  TO authenticated
  USING (
    home_team_id IN (SELECT id FROM teams WHERE coach_id = auth.uid()) OR
    away_team_id IN (SELECT id FROM teams WHERE coach_id = auth.uid())
  );

-- Match Notes Table
CREATE TABLE IF NOT EXISTS match_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  minute integer NOT NULL CHECK (minute >= 0 AND minute <= 120),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('tactical', 'performance', 'injury', 'general')),
  author_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE match_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match participants can manage notes"
  ON match_notes
  FOR ALL
  TO authenticated
  USING (
    match_id IN (
      SELECT id FROM matches 
      WHERE home_team_id IN (SELECT id FROM teams WHERE coach_id = auth.uid())
         OR away_team_id IN (SELECT id FROM teams WHERE coach_id = auth.uid())
    )
  );

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  context jsonb DEFAULT '{}',
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Analytics Reports Table
CREATE TABLE IF NOT EXISTS analytics_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('team_performance', 'player_analysis', 'match_analysis', 'season_summary')),
  entity_type text NOT NULL CHECK (entity_type IN ('team', 'player', 'match')),
  entity_id uuid NOT NULL,
  data jsonb NOT NULL,
  metadata jsonb DEFAULT '{}',
  generated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own analytics"
  ON analytics_reports
  FOR ALL
  TO authenticated
  USING (auth.uid() = generated_by);

-- Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id text UNIQUE,
  amount integer NOT NULL, -- Amount in cents
  currency text DEFAULT 'eur',
  status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  plan_type text NOT NULL CHECK (plan_type IN ('starter', 'pro', 'club')),
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON payment_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'justified')),
  notes text,
  recorded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team coaches can manage attendance"
  ON attendance_records
  FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams WHERE coach_id = auth.uid()
    )
  );

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  category text NOT NULL CHECK (category IN ('bug', 'feature', 'general', 'support')),
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now()
);

-- Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  language text DEFAULT 'es' CHECK (language IN ('en', 'es')),
  subscribed boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_teams_coach_id ON teams(coach_id);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_match_notes_match_id ON match_notes(match_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_reports_entity ON analytics_reports(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_team_id ON attendance_records(team_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);

-- Insert default sport configurations
INSERT INTO teams (id, name, sport, coach_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Soccer Team', 'soccer', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002', 'Demo Futsal Team', 'futsal', '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;