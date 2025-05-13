/*
  # Create redirects table

  1. New Tables
    - `redirects`
      - `id` (uuid, primary key)
      - `target_url` (text, not null)
      - `short_code` (text, unique)
      - `created_at` (timestamptz)
      - `clicks` (integer)

  2. Security
    - Enable RLS on `redirects` table
    - Add policies for public access to read redirects
    - Add policies for authenticated users to manage their own redirects
*/

CREATE TABLE IF NOT EXISTS redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_url text NOT NULL,
  short_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  clicks integer DEFAULT 0,
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to redirects for redirection
CREATE POLICY "Redirects are publicly viewable"
  ON redirects
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create their own redirects
CREATE POLICY "Users can create redirects"
  ON redirects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own redirects
CREATE POLICY "Users can update their own redirects"
  ON redirects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own redirects
CREATE POLICY "Users can delete their own redirects"
  ON redirects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);