/*
  # Add unique constraint to dev_planets user_id

  1. Changes
    - Add unique constraint on user_id column in dev_planets table
    - This ensures each user can only have one planet
    - Enables proper upsert operations using ON CONFLICT

  2. Security
    - No changes to RLS policies needed
    - Maintains existing access controls
*/

-- Add unique constraint to user_id column
ALTER TABLE dev_planets ADD CONSTRAINT unique_user_planet UNIQUE (user_id);