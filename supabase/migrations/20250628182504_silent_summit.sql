/*
  # Fix RLS policies for WebContainer environment

  1. Changes
    - Ensure all tables have proper RLS policies for WebContainer
    - Add service role bypass for system operations
    - Fix authentication context issues

  2. Security
    - Maintain security while allowing WebContainer operations
    - Ensure proper user isolation
*/

-- Temporarily disable RLS to fix policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE dev_planets DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE devlogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE code_battles DISABLE ROW LEVEL SECURITY;
ALTER TABLE test DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_planets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE devlogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;

DROP POLICY IF EXISTS "Anyone can read dev planets" ON dev_planets;
DROP POLICY IF EXISTS "Users can manage own planet" ON dev_planets;

DROP POLICY IF EXISTS "Anyone can read public projects" ON projects;
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;

DROP POLICY IF EXISTS "Anyone can read devlogs" ON devlogs;
DROP POLICY IF EXISTS "Users can manage own devlogs" ON devlogs;

DROP POLICY IF EXISTS "Users can read own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can manage own achievements" ON achievements;

DROP POLICY IF EXISTS "Anyone can read code battles" ON code_battles;
DROP POLICY IF EXISTS "Users can manage own battles" ON code_battles;

DROP POLICY IF EXISTS "Anyone can insert test records" ON test;
DROP POLICY IF EXISTS "Anyone can read test records" ON test;

-- Users table policies (more permissive for WebContainer)
CREATE POLICY "Allow user registration" ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read all profiles" ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id OR auth.role() = 'service_role');

-- Dev planets policies
CREATE POLICY "Anyone can read dev planets" ON dev_planets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own planet" ON dev_planets
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Projects policies
CREATE POLICY "Anyone can read public projects" ON projects
  FOR SELECT
  TO authenticated
  USING (NOT is_private OR user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- DevLogs policies
CREATE POLICY "Anyone can read devlogs" ON devlogs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own devlogs" ON devlogs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Achievements policies
CREATE POLICY "Users can read own achievements" ON achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can manage own achievements" ON achievements
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Code battles policies
CREATE POLICY "Anyone can read code battles" ON code_battles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own battles" ON code_battles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Test table policies (very permissive for testing)
CREATE POLICY "Anyone can insert test records" ON test
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read test records" ON test
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;