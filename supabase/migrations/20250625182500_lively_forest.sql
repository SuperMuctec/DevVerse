/*
  # DevVerse³ Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `password_hash` (text)
      - `avatar` (text, optional)
      - `bio` (text, optional)
      - `location` (text, optional)
      - `website` (text, optional)
      - `xp` (integer, default 0)
      - `level` (integer, default 1)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `language` (text)
      - `github_url` (text)
      - `homepage` (text, optional)
      - `topics` (text array)
      - `is_private` (boolean, default false)
      - `stars` (integer, default 0)
      - `forks` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `dev_planets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `stack_languages` (text array)
      - `stack_frameworks` (text array)
      - `stack_tools` (text array)
      - `stack_databases` (text array)
      - `color` (text, default '#00ffff')
      - `size` (decimal, default 1.0)
      - `rings` (integer, default 1)
      - `likes` (integer, default 0)
      - `views` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `devlogs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `tags` (text array)
      - `likes` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `achievement_id` (text)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `unlocked_at` (timestamp)

    - `code_battles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `difficulty` (text)
      - `time_limit` (integer)
      - `problem_title` (text)
      - `problem_description` (text)
      - `examples` (jsonb)
      - `constraints` (text array)
      - `status` (text, default 'waiting')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  avatar text,
  bio text,
  location text,
  website text,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  language text NOT NULL,
  github_url text NOT NULL,
  homepage text,
  topics text[] DEFAULT '{}',
  is_private boolean DEFAULT false,
  stars integer DEFAULT 0,
  forks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dev_planets table
CREATE TABLE IF NOT EXISTS dev_planets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  stack_languages text[] DEFAULT '{}',
  stack_frameworks text[] DEFAULT '{}',
  stack_tools text[] DEFAULT '{}',
  stack_databases text[] DEFAULT '{}',
  color text DEFAULT '#00ffff',
  size decimal DEFAULT 1.0,
  rings integer DEFAULT 1,
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create devlogs table
CREATE TABLE IF NOT EXISTS devlogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create code_battles table
CREATE TABLE IF NOT EXISTS code_battles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit integer NOT NULL,
  problem_title text NOT NULL,
  problem_description text NOT NULL,
  examples jsonb DEFAULT '[]',
  constraints text[] DEFAULT '{}',
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_planets ENABLE ROW LEVEL SECURITY;
ALTER TABLE devlogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_battles ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Anyone can read public projects" ON projects FOR SELECT TO authenticated USING (NOT is_private OR user_id = auth.uid());
CREATE POLICY "Users can manage own projects" ON projects FOR ALL TO authenticated USING (user_id = auth.uid());

-- Dev planets policies
CREATE POLICY "Anyone can read dev planets" ON dev_planets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own planet" ON dev_planets FOR ALL TO authenticated USING (user_id = auth.uid());

-- DevLogs policies
CREATE POLICY "Anyone can read devlogs" ON devlogs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own devlogs" ON devlogs FOR ALL TO authenticated USING (user_id = auth.uid());

-- Achievements policies
CREATE POLICY "Users can read own achievements" ON achievements FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL TO authenticated USING (user_id = auth.uid());

-- Code battles policies
CREATE POLICY "Anyone can read code battles" ON code_battles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own battles" ON code_battles FOR ALL TO authenticated USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_dev_planets_user_id ON dev_planets(user_id);
CREATE INDEX IF NOT EXISTS idx_devlogs_user_id ON devlogs(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_code_battles_user_id ON code_battles(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_planets_updated_at BEFORE UPDATE ON dev_planets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devlogs_updated_at BEFORE UPDATE ON devlogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_code_battles_updated_at BEFORE UPDATE ON code_battles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();