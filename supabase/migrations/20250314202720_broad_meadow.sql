/*
  # Fix Account Deletion Policies

  1. Changes
    - Drop existing policies before recreating them
    - Add cascade delete functionality
    - Update permissions for authenticated users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Grant appropriate permissions
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop policies for addresses table
  DROP POLICY IF EXISTS "Users can delete own address" ON public.addresses;
  DROP POLICY IF EXISTS "Users can read own address" ON public.addresses;
  DROP POLICY IF EXISTS "Users can update own address" ON public.addresses;
  DROP POLICY IF EXISTS "Users can insert own address" ON public.addresses;

  -- Drop policies for bank_accounts table
  DROP POLICY IF EXISTS "Users can delete own bank account" ON public.bank_accounts;
  DROP POLICY IF EXISTS "Users can read own bank account" ON public.bank_accounts;
  DROP POLICY IF EXISTS "Users can update own bank account" ON public.bank_accounts;
  DROP POLICY IF EXISTS "Users can insert own bank account" ON public.bank_accounts;

  -- Drop policies for users table
  DROP POLICY IF EXISTS "Users can delete own data" ON public.users;
  DROP POLICY IF EXISTS "Users can read own data" ON public.users;
  DROP POLICY IF EXISTS "Users can update own data" ON public.users;
  DROP POLICY IF EXISTS "Enable insert for registration" ON public.users;
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
END $$;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Enable insert for registration" ON public.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING ((auth.uid() = id) OR (auth.role() = 'service_role'::text));

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own data" ON public.users
  FOR DELETE
  USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT
  USING (true);

-- Create policies for addresses table
CREATE POLICY "Users can read own address" ON public.addresses
  FOR SELECT
  USING ((auth.uid() = user_id) OR (auth.role() = 'service_role'::text));

CREATE POLICY "Users can update own address" ON public.addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own address" ON public.addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own address" ON public.addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for bank_accounts table
CREATE POLICY "Users can read own bank account" ON public.bank_accounts
  FOR SELECT
  USING ((auth.uid() = user_id) OR (auth.role() = 'service_role'::text));

CREATE POLICY "Users can update own bank account" ON public.bank_accounts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank account" ON public.bank_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank account" ON public.bank_accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add cascade delete triggers
CREATE OR REPLACE FUNCTION delete_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete related data
  DELETE FROM public.addresses WHERE user_id = OLD.id;
  DELETE FROM public.bank_accounts WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS delete_user_data_trigger ON public.users;

CREATE TRIGGER delete_user_data_trigger
  BEFORE DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION delete_user_data();

-- Grant permissions
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO service_role;
GRANT DELETE ON public.users TO authenticated;
GRANT DELETE ON public.addresses TO authenticated;
GRANT DELETE ON public.bank_accounts TO authenticated;