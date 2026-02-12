import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';
import { Product } from '../types';

const Produtos: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('name');

      if (error) throw error;

      // Map database fields (snake_case) to frontend interface (camelCase) if needed
      // Currently assuming types.ts matches or we adapt here.
      // Based on Types.ts: image, oldPrice. DB: image_url, old_price
      const formattedProducts: Product[] = (data || []).map(p => ({
        ...p,
        image: p.image_url,
        oldPrice: p.old_price,
        rating: p.rating || 0,
        reviews: p.reviews || 0
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${productName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      // Atualizar lista local
      setProducts(products.filter(p => p.id !== productId));
      alert('Produto deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto. Verifique o console.');
    }
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })


  const categories = ['Todos', 'Rações Secas', 'Petiscos', 'Higiene & Limpeza', 'Brinquedos', 'Acessórios'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-icons text-primary text-sm">category</span> Categorias
            </h3>
            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className={`text-sm font-medium transition-colors ${selectedCategory === cat ? 'text-primary' : 'text-slate-600 dark:text-slate-300 group-hover:text-primary'}`}>{cat}</span>
                  <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {cat === 'Todos' ? products.length : products.filter(p => p.category === cat).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Produtos em Destaque</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mostrando {filteredProducts.length} de {products.length} produtos</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar produto..."
                  className="pl-9 pr-4 py-2 text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-200 focus:border-primary focus:ring-primary shadow-sm w-full sm:w-64"
                />
                <span className="material-icons absolute left-2.5 top-2 text-slate-400 text-lg">search</span>
              </div>
              <button
                onClick={() => navigate('/novo-produto')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-md shadow-cyan-500/20 whitespace-nowrap"
              >
                <span className="material-icons text-sm">add</span>
                Adicionar Produto
              </button>

            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                <div className="relative pt-[80%] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img src={product.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                      {product.discount}
                    </div>
                  )}
                  {product.status && (
                    <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded shadow-sm ${product.status === 'NOVO' ? 'bg-green-500' : 'bg-gray-800'}`}>
                      {product.status}
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-surface-dark rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    title="Deletar produto"
                  >
                    <span className="material-icons text-lg">delete</span>
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">{product.category}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug mb-2 line-clamp-2" title={product.name}>{product.name}</h3>

                  <div className="mt-auto">
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">R$ {product.price.toFixed(2)}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-slate-400 line-through mb-1">R$ {product.oldPrice.toFixed(2)}</span>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                Nunhum produto encontrado.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
