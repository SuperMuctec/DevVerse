/*
  # Fix User Registration RLS Policy

  1. Security Updates
    - Update the user registration policy to properly allow INSERT operations
    - Ensure anonymous users can create accounts during registration
    - Fix the policy to work with the current authentication flow

  2. Changes
    - Drop and recreate the user registration policy with proper permissions
    - Ensure the policy allows INSERT operations for both anonymous and authenticated users during registration
*/

-- Drop the existing policy that might be causing issues
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create a new policy that allows user registration
CREATE POLICY "Allow user registration" 
  ON users 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing policies are properly configured
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
CREATE POLICY "Users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON users;
CREATE POLICY "Users can delete own profile"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);