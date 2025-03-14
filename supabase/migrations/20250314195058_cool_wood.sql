/*
  # Create Address and Bank Account Tables

  1. New Tables
    - `addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `cep` (text)
      - `street` (text)
      - `number` (text)
      - `complement` (text)
      - `neighborhood` (text)
      - `city` (text)
      - `state` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `bank_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `bank` (text)
      - `account_type` (text)
      - `agency` (text)
      - `account` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Remove address and bank columns from users table
    - Add foreign key constraints
    - Enable RLS
    - Add policies for data access

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create addresses table
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  cep text,
  street text,
  number text,
  complement text,
  neighborhood text,
  city text,
  state text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bank text,
  account_type text,
  agency text,
  account text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for addresses
CREATE POLICY "Users can read own address"
  ON public.addresses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

-- Create policies for bank_accounts
CREATE POLICY "Users can read own bank account"
  ON public.bank_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Migrate existing data from users table to new tables
INSERT INTO public.addresses (
  user_id, cep, street, number, complement, neighborhood, city, state
)
SELECT 
  id as user_id,
  cep,
  street,
  number,
  complement,
  neighborhood,
  city,
  state
FROM public.users
WHERE cep IS NOT NULL
  OR street IS NOT NULL
  OR number IS NOT NULL
  OR complement IS NOT NULL
  OR neighborhood IS NOT NULL
  OR city IS NOT NULL
  OR state IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.bank_accounts (
  user_id, bank, account_type, agency, account
)
SELECT 
  id as user_id,
  bank,
  account_type,
  agency,
  account
FROM public.users
WHERE bank IS NOT NULL
  OR account_type IS NOT NULL
  OR agency IS NOT NULL
  OR account IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Remove old columns from users table
ALTER TABLE public.users
  DROP COLUMN IF EXISTS cep,
  DROP COLUMN IF EXISTS street,
  DROP COLUMN IF EXISTS number,
  DROP COLUMN IF EXISTS complement,
  DROP COLUMN IF EXISTS neighborhood,
  DROP COLUMN IF EXISTS city,
  DROP COLUMN IF EXISTS state,
  DROP COLUMN IF EXISTS bank,
  DROP COLUMN IF EXISTS account_type,
  DROP COLUMN IF EXISTS agency,
  DROP COLUMN IF EXISTS account;

-- Grant permissions
GRANT ALL ON public.addresses TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;

GRANT ALL ON public.bank_accounts TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;