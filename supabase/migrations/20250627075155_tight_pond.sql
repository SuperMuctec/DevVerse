/*
  # Add planet categories

  1. Changes
    - Add categories column to dev_planets table
    - Categories will be an array of strings representing planet types
    - Users can select up to 2 categories when creating/updating their planet

  2. Security
    - No changes to RLS policies needed
*/

-- Add categories column to dev_planets table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dev_planets' AND column_name = 'categories'
  ) THEN
    ALTER TABLE dev_planets ADD COLUMN categories text[] DEFAULT '{}';
  END IF;
END $$;