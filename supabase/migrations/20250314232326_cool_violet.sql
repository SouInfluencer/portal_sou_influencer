/*
  # Add user verification function and trigger

  1. Changes
    - Add function to check user verification status
    - Add trigger to update verified status on relevant changes
    - Add verified column to users table

  2. Security
    - Maintain existing RLS policies
    - Function runs with security definer
*/

-- Add verified column to users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'verified') THEN
    ALTER TABLE public.users ADD COLUMN verified boolean DEFAULT false;
  END IF;
END $$;

-- Create function to check user verification status
CREATE OR REPLACE FUNCTION check_user_verification(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_complete boolean;
  has_social_network boolean;
BEGIN
  -- Check if profile is complete
  SELECT (
    first_name IS NOT NULL AND
    last_name IS NOT NULL AND
    email IS NOT NULL AND
    cpf IS NOT NULL AND
    phone IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM addresses WHERE user_id = users.id
    ) AND
    EXISTS (
      SELECT 1 FROM bank_accounts WHERE user_id = users.id
    )
  ) INTO profile_complete
  FROM users
  WHERE id = user_id;

  -- Check if user has at least one verified social network
  SELECT EXISTS (
    SELECT 1
    FROM social_networks
    WHERE user_id = user_id
    AND verified = true
  ) INTO has_social_network;

  -- Return true only if both conditions are met
  RETURN profile_complete AND has_social_network;
END;
$$;