-- 1. Criar a tabela de produtos
CREATE TABLE IF NOT EXISTS public.produtos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  old_price numeric,
  discount text,
  rating numeric DEFAULT 0,
  reviews integer DEFAULT 0,
  image_url text,
  status text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar segurança (RLS - Row Level Security)
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- 3. Criar política de leitura pública (qualquer um pode ver os produtos)
CREATE POLICY "Produtos são públicos" ON public.produtos FOR SELECT USING (true);

-- 4. Criar política de escrita (apenas usuários autenticados podem criar/editar/deletar)
CREATE POLICY "Apenas autenticados podem modificar produtos" ON public.produtos FOR ALL USING (auth.role() = 'authenticated');

-- 5. Inserir alguns dados de exemplo (os mesmos que tínhamos no código)
INSERT INTO public.produtos (name, category, price, old_price, discount, rating, reviews, image_url, status)
VALUES
  ('Ração Premium Golden Formula Frango e Arroz 15kg', 'Rações Secas', 149.90, 176.90, '-15%', 4.5, 128, 'https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=1000&auto=format&fit=crop', NULL),
  ('Mordedor Resistente Kong Classic Vermelho - Médio', 'Brinquedos', 69.90, NULL, NULL, 5.0, 54, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1000&auto=format&fit=crop', NULL),
  ('Shampoo Pet Clean 5 em 1 para Cães e Gatos 700ml', 'Higiene & Limpeza', 22.50, NULL, NULL, 4.0, 12, 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?q=80&w=1000&auto=format&fit=crop', 'NOVO'),
  ('Cama Nuvem Pet Redonda - Tamanho G', 'Acessórios', 119.90, 149.90, '-20%', 4.8, 89, 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=1000&auto=format&fit=crop', NULL),
  ('Petisco Bifinho Keldog Carne 500g', 'Petiscos', 24.90, NULL, NULL, 4.7, 215, 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?q=80&w=1000&auto=format&fit=crop', NULL),
  ('Coleira Peitoral Antipuxão com Guia', 'Acessórios', 89.90, NULL, NULL, 4.6, 42, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=1000&auto=format&fit=crop', NULL),
  ('Arranhador para Gatos Torre 3 Andares', 'Brinquedos', 189.90, 229.90, NULL, 4.9, 34, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=1000&auto=format&fit=crop', NULL),
  ('Tapete Higiênico Super Secão 30 Unidades', 'Higiene & Limpeza', 54.90, NULL, NULL, 4.3, 156, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop', NULL),
  ('Fonte de Água Automática para Gatos', 'Acessórios', 129.90, NULL, NULL, 4.8, 67, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop', 'NOVO');
