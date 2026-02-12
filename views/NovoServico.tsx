
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';

const NovoServico: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    duration: '',
    price: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('services')
        .upload(filePath, imageFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('services')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || !formData.description || !formData.duration) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      let imageUrl = 'https://via.placeholder.com/200';
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const serviceData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        duration: formData.duration,
        price: parseFloat(formData.price.replace('R$', '').replace(',', '.').trim()),
        image_url: imageUrl
      };

      const { error } = await supabase
        .from('servicos')
        .insert([serviceData]);

      if (error) throw error;

      alert('Serviço cadastrado com sucesso!');
      navigate('/servicos');
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar serviço. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Adicionar Novo Serviço</h1>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden w-full">
        <div className="p-8 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-icons">add_circle_outline</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Informações do Serviço</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Preencha os detalhes abaixo para cadastrar um novo serviço no catálogo.</p>
            </div>
          </div>
        </div>
        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Nome do Serviço <span className="text-red-500">*</span></label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:text-white"
              placeholder="Ex: Banho Premium com Hidratação"
              type="text"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Categoria <span className="text-red-500">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:text-white cursor-pointer"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="Higiene">Higiene</option>
                <option value="Saúde">Saúde</option>
                <option value="Estética">Estética</option>
                <option value="Bem-estar">Bem-estar</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Preço de Venda (R$) <span className="text-red-500">*</span></label>
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:text-white font-medium"
                placeholder="0,00"
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Duração <span className="text-red-500">*</span></label>
            <input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:text-white"
              placeholder="Ex: 60 min"
              type="text"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Descrição <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:text-white"
              placeholder="Descreva o serviço oferecido"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Imagem do Serviço</label>
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
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all font-medium shadow-md shadow-primary/20 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (
                <>
                  <span className="material-icons">save</span>
                  Salvar Serviço
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoServico;
