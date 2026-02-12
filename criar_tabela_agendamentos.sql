-- Drop existing table if it exists
DROP TABLE IF EXISTS agendamentos CASCADE;

-- Create agendamentos (appointments) table
CREATE TABLE agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  professional TEXT NOT NULL,
  professional_initials TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Create policies for full access
CREATE POLICY "Enable read access for all users" ON agendamentos
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users" ON agendamentos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON agendamentos
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for all users" ON agendamentos
  FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_agendamentos_pet ON agendamentos(pet_id);
CREATE INDEX idx_agendamentos_servico ON agendamentos(servico_id);
CREATE INDEX idx_agendamentos_date ON agendamentos(date);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
