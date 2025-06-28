/*
  # Fix RLS policies for user registration

  1. Changes
    - Disable RLS temporarily on users table to allow registration
    - Add proper RLS policies that allow user registration
    - Ensure authenticated users can read/write their own data

  2. Security
    - Allow anonymous users to insert (for registration)
    - Allow authenticated users to read all users (for search/discovery)
    - Allow users to update their own data only
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
  WITH CHECK (true);

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
ALTER TABLE dev_planets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read dev planets" ON dev_planets;
DROP POLICY IF EXISTS "Users can manage own planet" ON dev_planets;

CREATE POLICY "Anyone can read dev planets" ON dev_planets
  FOR SELECT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can manage own planet" ON dev_planets
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Projects
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
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DevLogs
ALTER TABLE devlogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read devlogs" ON devlogs;
DROP POLICY IF EXISTS "Users can manage own devlogs" ON devlogs;

CREATE POLICY "Anyone can read devlogs" ON devlogs
  FOR SELECT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can manage own devlogs" ON devlogs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Achievements
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
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Code Battles
ALTER TABLE code_battles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read code battles" ON code_battles;
DROP POLICY IF EXISTS "Users can manage own battles" ON code_battles;

CREATE POLICY "Anyone can read code battles" ON code_battles
  FOR SELECT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can manage own battles" ON code_battles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());