-- Criar bucket para imagens de produtos (público para leitura)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Qualquer um pode ler (visualizar) as imagens
CREATE POLICY "Imagens de produtos são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Política: Apenas usuários autenticados podem fazer upload
CREATE POLICY "Usuários autenticados podem fazer upload de produtos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Política: Apenas usuários autenticados podem atualizar
CREATE POLICY "Usuários autenticados podem atualizar imagens de produtos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Política: Apenas usuários autenticados podem deletar
CREATE POLICY "Usuários autenticados podem deletar imagens de produtos"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');
