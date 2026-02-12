
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';

const NovoPet: React.FC = () => {
    const navigate = useNavigate();
    const { clientId, petId } = useParams<{ clientId: string; petId: string }>();
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        age: '',
        weight: '',
        gender: 'male'
    });

    useEffect(() => {
        if (petId) {
            fetchPetData();
        } else if (clientId) {
            fetchClientName(clientId);
        }
    }, [clientId, petId]);

    const fetchPetData = async () => {
        if (!petId) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('id', petId)
            .single();

        if (error) {
            console.error('Error fetching pet:', error);
            setError('Erro ao carregar dados do pet.');
            setLoading(false);
            return;
        }

        if (data) {
            setFormData({
                name: data.name,
                breed: data.breed || '',
                age: data.age || '',
                weight: data.weight || '',
                gender: data.gender || 'male'
            });
            if (data.cliente_id) {
                fetchClientName(data.cliente_id);
            }
        }
        setLoading(false);
    };

    const fetchClientName = async (id: string) => {
        const { data, error } = await supabase
            .from('clientes')
            .select('name')
            .eq('id', id)
            .single();

        if (data) {
            setClientName(data.name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Must have either a clientId (new) or existing data (edit)
        // For edit, we assume the relationship is already set in the DB

        setLoading(true);
        setError(null);

        try {
            if (petId) {
                // Edit mode
                const { error: updateError } = await supabase
                    .from('pets')
                    .update({
                        name: formData.name,
                        breed: formData.breed,
                        age: formData.age,
                        weight: formData.weight,
                        gender: formData.gender
                    })
                    .eq('id', petId);

                if (updateError) throw updateError;
            } else {
                // Create mode
                if (!clientId) throw new Error('Cliente não identificado.');

                const { error: insertError } = await supabase
                    .from('pets')
                    .insert([
                        {
                            ...formData,
                            cliente_id: clientId,
                            image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' // Default image for now
                        }
                    ]);

                if (insertError) throw insertError;
            }

            navigate('/clientes');
        } catch (err: any) {
            console.error('Error saving pet:', err);
            setError(err.message || 'Erro ao salvar pet.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                >
                    <span className="material-icons">arrow_back</span>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{petId ? 'Editar Pet' : 'Cadastrar Novo Pet'}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {petId ? 'Editando pet de ' : 'Adicionando pet para '} <span className="font-semibold text-primary">{clientName}</span>
                    </p>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 flex items-center gap-2">
                        <span className="material-icons text-base">error_outline</span>
                        {error}
                    </div>
                )}

                <form className="divide-y divide-slate-200 dark:divide-slate-700" onSubmit={handleSubmit}>
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-icons text-sm">pets</span>
                            </span>
                            Informações do Pet
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Pet</label>
                                <input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    placeholder="Ex: Rex"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Raça</label>
                                <input
                                    id="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    placeholder="Ex: Golden Retriever"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Idade</label>
                                <input
                                    id="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    placeholder="Ex: 2 anos"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Peso</label>
                                <input
                                    id="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    placeholder="Ex: 5kg"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gênero</label>
                                <select
                                    id="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                >
                                    <option value="male">Macho</option>
                                    <option value="female">Fêmea</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-5 md:px-8 bg-slate-50 dark:bg-slate-800/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="material-icons text-lg mr-2">{loading ? 'sync' : 'save'}</span>
                            {loading ? 'Salvando...' : 'Salvar Pet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NovoPet;
