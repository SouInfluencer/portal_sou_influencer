/*
  # Create storage bucket for profile images

  1. New Storage Bucket
    - `profile-images` bucket for storing user profile and cover images
    - Public access enabled for reading images
    - Only authenticated users can upload

  2. Security
    - Enable public access for reading
    - Restrict uploads to authenticated users
    - Set proper CORS and cache settings
*/

-- Enable storage by creating the storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.role() = 'authenticated'
);

-- Create policy to allow public access to read files
CREATE POLICY "Public users can view profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- Create policy to allow users to update their own files
CREATE POLICY "Users can update own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'profile-images' AND owner = auth.uid());

-- Create policy to allow users to delete their own files
CREATE POLICY "Users can delete own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid());