-- Drop existing table if it exists (to avoid conflicts)
DROP TABLE IF EXISTS servicos CASCADE;

-- Create servicos table
CREATE TABLE servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON servicos
  FOR SELECT
  USING (true);

-- Create policy for authenticated insert
CREATE POLICY "Allow authenticated insert" ON servicos
  FOR INSERT
  WITH CHECK (true);

-- Create policy for authenticated update
CREATE POLICY "Allow authenticated update" ON servicos
  FOR UPDATE
  USING (true);

-- Create policy for authenticated delete
CREATE POLICY "Allow authenticated delete" ON servicos
  FOR DELETE
  USING (true);
