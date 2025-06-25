/*
  # Fix RLS policies for users table

  1. Security Updates
    - Add policy to allow user registration (INSERT for anonymous users)
    - Update existing policies to ensure proper access control
    - Allow authenticated users to read all user profiles
    - Allow users to update their own profiles
    - Allow anonymous users to create new accounts

  2. Changes
    - Add INSERT policy for anonymous users during registration
    - Ensure SELECT policy allows reading user profiles
    - Maintain UPDATE policy for users to edit their own profiles
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Allow anonymous users to insert new users during registration
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all user profiles
CREATE POLICY "Users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile (optional)
CREATE POLICY "Users can delete own profile"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);