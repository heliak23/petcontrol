-- PARTE 2: Configurar políticas do Storage bucket 'services'
-- Execute este código no SQL Editor do Supabase

-- Permite upload de imagens (INSERT)
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'services');

-- Permite leitura de imagens (SELECT)
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services');

-- Permite atualização de imagens (UPDATE)
CREATE POLICY "Allow public updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'services');

-- Permite deletar imagens (DELETE)
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'services');
