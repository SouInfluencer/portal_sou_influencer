/*
  # Fix RLS policies for user registration

  1. Changes
    - Add policy to allow inserting new users
    - Update existing policies for better security
    - Add policy for public profile access
  
  2. Security
    - Enable RLS on users table
    - Add policies for CRUD operations
    - Grant necessary permissions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Create new policies
CREATE POLICY "Enable insert for registration" ON public.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (
    auth.uid() = id OR
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT
  USING (true);

-- Grant permissions
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO service_role;
GRANT INSERT ON public.users TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT, UPDATE ON public.users TO authenticated;