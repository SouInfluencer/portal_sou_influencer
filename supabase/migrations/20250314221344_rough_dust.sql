/*
  # Create categories table and relationships

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public read access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories 
  FOR SELECT 
  TO public 
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert default categories
INSERT INTO public.categories (name, description, icon) VALUES
  ('Tech', 'Tecnologia e gadgets', 'Laptop'),
  ('Lifestyle', 'Estilo de vida e bem-estar', 'Heart'),
  ('Gaming', 'Jogos e entretenimento', 'Gamepad'),
  ('Fashion', 'Moda e tendências', 'Shirt'),
  ('Beauty', 'Beleza e cosméticos', 'Sparkles'),
  ('Food', 'Gastronomia e culinária', 'Utensils'),
  ('Travel', 'Viagens e turismo', 'Plane'),
  ('Fitness', 'Fitness e saúde', 'Dumbbell'),
  ('Education', 'Educação e conhecimento', 'GraduationCap'),
  ('Business', 'Negócios e empreendedorismo', 'Briefcase');

-- Grant permissions
GRANT ALL ON public.categories TO postgres;
GRANT ALL ON public.categories TO service_role;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.categories TO authenticated;