/*
  # Create test table for database connection testing

  1. New Tables
    - `test`
      - `id` (uuid, primary key)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `test` table
    - Add policy for authenticated users to insert and read test records
*/

-- Create test table
CREATE TABLE IF NOT EXISTS test (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE test ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert and read test records
CREATE POLICY "Anyone can insert test records" ON test
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read test records" ON test
  FOR SELECT
  TO authenticated
  USING (true);