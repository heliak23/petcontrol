-- PARTE 1: Corrigir políticas da tabela servicos
-- Execute este código no SQL Editor do Supabase

-- Primeiro, remove as políticas antigas
DROP POLICY IF EXISTS "Allow public read access" ON servicos;
DROP POLICY IF EXISTS "Allow authenticated insert" ON servicos;
DROP POLICY IF EXISTS "Allow authenticated update" ON servicos;
DROP POLICY IF EXISTS "Allow authenticated delete" ON servicos;

-- Cria novas políticas mais permissivas
CREATE POLICY "Enable read access for all users" ON servicos
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users" ON servicos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON servicos
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for all users" ON servicos
  FOR DELETE
  USING (true);
