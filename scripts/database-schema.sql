-- Enhanced CivicHero Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Core Tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  county VARCHAR(25) NOT NULL,
  language VARCHAR(2) DEFAULT 'sw' CHECK (language IN ('en', 'sw')),
  tokens INT DEFAULT 0,
  role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'partner')),
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'banned', 'restricted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(200) NOT NULL,
  title_sw VARCHAR(200) NOT NULL,
  content_en TEXT NOT NULL,
  content_sw TEXT NOT NULL,
  difficulty INT CHECK (difficulty BETWEEN 1 AND 3),
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title_en VARCHAR(200) NOT NULL,
  title_sw VARCHAR(200) NOT NULL,
  description_en TEXT NOT NULL,
  description_sw TEXT NOT NULL,
  reward INT NOT NULL,
  location GEOGRAPHY(POINT),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress Tables
CREATE TABLE user_lessons (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  progress INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE user_tasks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_image_url TEXT,
  submission_notes TEXT,
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  UNIQUE(user_id, task_id)
);

-- Token System
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'spent', 'bonus', 'penalty')),
  source VARCHAR(50) NOT NULL, -- 'lesson', 'task', 'reward', 'admin'
  source_id INT, -- ID of the lesson/task/reward
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Tables
CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'user', 'lesson', 'task', etc.
  target_id TEXT,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Partner System
CREATE TABLE partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_email VARCHAR(100),
  contact_phone VARCHAR(15),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE partner_offers (
  id SERIAL PRIMARY KEY,
  partner_id INT REFERENCES partners(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  token_value INT NOT NULL,
  stock_count INT DEFAULT 0,
  redemption_code VARCHAR(20) UNIQUE,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reward_redemptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  offer_id INT REFERENCES partner_offers(id) ON DELETE CASCADE,
  redemption_code VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency System
CREATE TABLE emergency_reports (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'medical', 'fire', 'security', 'other'
  description TEXT,
  location GEOGRAPHY(POINT),
  status VARCHAR(20) DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'resolved')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Leaderboard and Gamification
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_county ON users(county);
CREATE INDEX idx_users_tokens ON users(tokens DESC);
CREATE INDEX idx_user_lessons_user_id ON user_lessons(user_id);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_status ON user_tasks(status);
CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at DESC);
CREATE INDEX idx_tasks_location ON tasks USING GIST(location);
CREATE INDEX idx_emergency_reports_location ON emergency_reports USING GIST(location);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own lessons" ON user_lessons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lessons" ON user_lessons
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON user_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON user_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON token_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own emergency reports" ON emergency_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency reports" ON emergency_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_user_tokens()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET tokens = tokens + NEW.amount,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER token_transaction_trigger
  AFTER INSERT ON token_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tokens();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
