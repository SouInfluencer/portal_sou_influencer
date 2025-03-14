/*
  # Fix Settings Error

  1. Changes
    - Add ON CONFLICT DO UPDATE clauses to upsert operations
    - Add missing indexes for user_id columns
    - Add missing foreign key constraints
    - Add missing RLS policies

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
    - Ensure proper user access control
*/

-- Add missing indexes and foreign key constraints
CREATE INDEX IF NOT EXISTS addresses_user_id_idx ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS bank_accounts_user_id_idx ON public.bank_accounts(user_id);

-- Ensure foreign key constraints exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'addresses_user_id_fkey'
  ) THEN
    ALTER TABLE public.addresses
    ADD CONSTRAINT addresses_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bank_accounts_user_id_fkey'
  ) THEN
    ALTER TABLE public.bank_accounts
    ADD CONSTRAINT bank_accounts_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own address" ON public.addresses;
DROP POLICY IF EXISTS "Users can update own address" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert own address" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete own address" ON public.addresses;

DROP POLICY IF EXISTS "Users can read own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can update own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can insert own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can delete own bank account" ON public.bank_accounts;

-- Create updated policies for addresses
CREATE POLICY "Users can read own address"
  ON public.addresses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can update own address"
  ON public.addresses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own address"
  ON public.addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own address"
  ON public.addresses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated policies for bank_accounts
CREATE POLICY "Users can read own bank account"
  ON public.bank_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can update own bank account"
  ON public.bank_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank account"
  ON public.bank_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank account"
  ON public.bank_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.addresses TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;

GRANT ALL ON public.bank_accounts TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;