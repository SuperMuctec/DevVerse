/*
  # Fix Row Level Security Policies

  1. Changes
    - Disable and re-enable RLS on all tables
    - Create proper RLS policies without syntax errors
    - Allow anonymous registration
    - Ensure proper access control for all tables

  2. Security
    - Anonymous users can register (INSERT into users)
    - Authenticated users can read all profiles
    - Users can only modify their own data
    - Proper RLS policies for all tables
*/

-- First, let's check if RLS is enabled and disable it temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;

-- Allow anonymous users to insert (for registration)
CREATE POLICY "Allow user registration" ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all user profiles
CREATE POLICY "Users can read all profiles" ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Ensure other tables have proper RLS policies
-- Dev Planets
ALTER TABLE dev_planets DISABLE ROW LEVEL SECURITY;
ALTER TABLE dev_planets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read dev planets" ON dev_planets;
DROP POLICY IF EXISTS "Users can manage own planet" ON dev_planets;

CREATE POLICY "Anyone can read dev planets" ON dev_planets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own planet" ON dev_planets
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Projects
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read public projects" ON projects;
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;

CREATE POLICY "Anyone can read public projects" ON projects
  FOR SELECT
  TO authenticated
  USING (NOT is_private OR user_id = auth.uid());

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- DevLogs
ALTER TABLE devlogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE devlogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read devlogs" ON devlogs;
DROP POLICY IF EXISTS "Users can manage own devlogs" ON devlogs;

CREATE POLICY "Anyone can read devlogs" ON devlogs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own devlogs" ON devlogs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Achievements
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can manage own achievements" ON achievements;

CREATE POLICY "Users can read own achievements" ON achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own achievements" ON achievements
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Code Battles
ALTER TABLE code_battles DISABLE ROW LEVEL SECURITY;
ALTER TABLE code_battles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read code battles" ON code_battles;
DROP POLICY IF EXISTS "Users can manage own battles" ON code_battles;

CREATE POLICY "Anyone can read code battles" ON code_battles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own battles" ON code_battles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());