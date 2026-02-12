
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';

const NovoProduto: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    old_price: '',

    status: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      let imageUrl = 'https://via.placeholder.com/300';
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price.replace('R$', '').replace(',', '.').trim()),
        old_price: formData.old_price ? parseFloat(formData.old_price.replace('R$', '').replace(',', '.').trim()) : null,

        status: formData.status || null,
        image_url: imageUrl,
        rating: 0,
        reviews: 0
      };

      const { error } = await supabase
        .from('produtos')
        .insert([productData]);

      if (error) throw error;

      alert('Produto cadastrado com sucesso!');
      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <span className="material-icons">arrow_back</span>
          <span className="font-medium hidden sm:inline">Voltar</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cadastrar Novo Produto</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Preencha as informações para adicionar um novo item ao catálogo.</p>
        </div>
      </div>

      <form
        className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
        onSubmit={handleSubmit}
      >
        <div className="p-8 space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-1.5 rounded-lg material-icons text-sm">info</span>
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Produto *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary shadow-sm"
                  placeholder="Ex: Ração Golden Formula 15kg"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Categoria *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary shadow-sm"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Rações Secas">Rações Secas</option>
                  <option value="Petiscos">Petiscos</option>
                  <option value="Higiene & Limpeza">Higiene & Limpeza</option>
                  <option value="Brinquedos">Brinquedos</option>
                  <option value="Acessórios">Acessórios</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Preço (R$) *</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary shadow-sm"
                  placeholder="Ex: 149.90"
                  type="number"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Preço Antigo (Opcional)</label>
                <input
                  name="old_price"
                  value={formData.old_price}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary shadow-sm"
                  placeholder="Ex: 179.90"
                  type="number"
                  step="0.01"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tag de Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary shadow-sm"
                >
                  <option value="">Nenhum</option>
                  <option value="NOVO">NOVO</option>
                  <option value="ESGOTADO">ESGOTADO</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Imagem do Produto</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP até 5MB</p>
                  </div>
                  {imagePreview && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg shadow-sm"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Salvando...' : (
              <>
                <span className="material-icons text-sm">save</span>
                Salvar Produto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovoProduto;
