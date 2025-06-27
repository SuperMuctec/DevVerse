/*
  # Add update_planet_likes function

  1. Functions
    - `update_planet_likes` - Function to safely increment/decrement planet likes
  
  2. Security
    - Function uses security definer to ensure proper access control
    - Validates that the planet exists before updating
*/

-- Create function to update planet likes
CREATE OR REPLACE FUNCTION update_planet_likes(planet_id uuid, increment_value integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the likes count for the specified planet
  UPDATE dev_planets 
  SET likes = GREATEST(0, COALESCE(likes, 0) + increment_value)
  WHERE id = planet_id;
  
  -- Check if the planet was found and updated
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Planet not found';
  END IF;
END;
$$;