/*
  # TQ Pictures Database Schema

  ## Overview
  Complete database schema for TQ Pictures photography company platform with authentication, bookings, and image management.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, not null)
  - `full_name` (text)
  - `phone` (text)
  - `is_admin` (boolean, default false)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  Purpose: Extended user profile information beyond Supabase auth

  ### 2. bookings
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, not null)
  - `full_name` (text, not null)
  - `email` (text, not null)
  - `phone` (text, not null)
  - `booking_date` (date, not null)
  - `booking_time` (time, not null)
  - `reason` (text, not null)
  - `status` (text, default 'pending')
  - `created_at` (timestamptz, default now())
  
  Purpose: Store photoshoot booking requests from users

  ### 3. images
  - `id` (uuid, primary key)
  - `file_path` (text, not null)
  - `file_name` (text, not null)
  - `uploaded_by` (uuid, references profiles, not null)
  - `created_at` (timestamptz, default now())
  
  Purpose: Track uploaded images and who uploaded them

  ### 4. user_images
  - `id` (uuid, primary key)
  - `image_id` (uuid, references images, not null)
  - `user_id` (uuid, references profiles, not null)
  - `assigned_at` (timestamptz, default now())
  - Unique constraint on (image_id, user_id)
  
  Purpose: Many-to-many relationship between users and images they can access

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Restrictive policies ensure users only access their own data
  - Admins have elevated permissions for image management
  - Bookings are private to the user who created them and admins

  ### Policies

  #### profiles table:
  1. Users can view their own profile
  2. Users can update their own profile
  3. Users can insert their own profile (for registration)

  #### bookings table:
  1. Users can view their own bookings
  2. Admins can view all bookings
  3. Authenticated users can create bookings
  4. Users can update their own bookings

  #### images table:
  1. Admins can view all images
  2. Admins can insert images
  3. Users can view images assigned to them

  #### user_images table:
  1. Admins can manage all assignments
  2. Users can view their own assignments

  ## Important Notes
  - Email/password authentication is handled by Supabase Auth
  - The profiles table extends the auth.users table
  - Admin status is controlled via the is_admin field
  - Images are linked to specific users through the user_images junction table
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL,
  file_name text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_images junction table
CREATE TABLE IF NOT EXISTS user_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id uuid REFERENCES images(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(image_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Images policies
CREATE POLICY "Admins can view all images"
  ON images FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Users can view assigned images"
  ON images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_images 
      WHERE user_images.image_id = images.id 
      AND user_images.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert images"
  ON images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can delete images"
  ON images FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- User images policies
CREATE POLICY "Admins can view all user image assignments"
  ON user_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Users can view own image assignments"
  ON user_images FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can create user image assignments"
  ON user_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can delete user image assignments"
  ON user_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for photos bucket
CREATE POLICY "Admins can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'photos' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can view all photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'photos' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Users can view assigned photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'photos' AND
    EXISTS (
      SELECT 1 FROM user_images 
      JOIN images ON images.id = user_images.image_id
      WHERE user_images.user_id = auth.uid() 
      AND images.file_path = storage.objects.name
    )
  );

CREATE POLICY "Admins can delete photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'photos' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );