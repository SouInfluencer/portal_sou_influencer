/*
  # Add categories to social networks

  1. New Table
    - `social_network_categories`
      - `id` (uuid, primary key)
      - `social_network_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create social_network_categories table
CREATE TABLE IF NOT EXISTS public.social_network_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_network_id uuid REFERENCES public.social_networks(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(social_network_id, category_id)
);

-- Enable RLS
ALTER TABLE public.social_network_categories ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX social_network_categories_social_network_id_idx ON public.social_network_categories(social_network_id);
CREATE INDEX social_network_categories_category_id_idx ON public.social_network_categories(category_id);

-- Create policies
CREATE POLICY "Users can read own social network categories"
  ON public.social_network_categories
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.social_networks
    WHERE id = social_network_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own social network categories"
  ON public.social_network_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.social_networks
    WHERE id = social_network_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own social network categories"
  ON public.social_network_categories
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.social_networks
    WHERE id = social_network_id AND user_id = auth.uid()
  ));

-- Grant permissions
GRANT ALL ON public.social_network_categories TO postgres;
GRANT ALL ON public.social_network_categories TO service_role;
GRANT SELECT, INSERT, DELETE ON public.social_network_categories TO authenticated;