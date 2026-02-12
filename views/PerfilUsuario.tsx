import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';
import { useAuth } from '../src/context/AuthContext';

const PerfilUsuario: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
            setFullName(user.user_metadata?.full_name || '');
            setRole(user.user_metadata?.role || '');
            setAvatarUrl(user.user_metadata?.avatar_url || '');
            setPreviewUrl(user.user_metadata?.avatar_url || '');
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setMessage({ text: 'Por favor, selecione uma imagem válida.', type: 'error' });
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ text: 'A imagem deve ter no máximo 2MB.', type: 'error' });
                return;
            }

            setAvatarFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatar = async (): Promise<string | null> => {
        if (!avatarFile || !user) return null;

        setUploading(true);
        try {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${user.id}/avatar.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (error: any) {
            console.error('Erro ao fazer upload:', error);
            setMessage({ text: 'Erro ao fazer upload da imagem: ' + error.message, type: 'error' });
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let newAvatarUrl = avatarUrl;

            // Upload new avatar if selected
            if (avatarFile) {
                const uploadedUrl = await uploadAvatar();
                if (uploadedUrl) {
                    newAvatarUrl = uploadedUrl;
                } else {
                    throw new Error('Falha no upload da imagem');
                }
            }

            // Update user metadata
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    role: role,
                    avatar_url: newAvatarUrl
                }
            });

            if (error) throw error;

            setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
            setAvatarFile(null);

        } catch (error: any) {
            console.error('Erro ao atualizar perfil:', error);
            setMessage({ text: 'Erro ao atualizar perfil: ' + error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                >
                    <span className="material-icons">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Meu Perfil</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie suas informações pessoais.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <form className="divide-y divide-slate-100 dark:divide-slate-800" onSubmit={handleSubmit}>
                    <div className="p-8">

                        <div className="flex flex-col items-center mb-8">
                            <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden relative mb-4">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${fullName}&background=random`;
                                        }}
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                                        <span className="material-icons text-4xl">person</span>
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                                    <span className="material-icons text-sm">upload</span>
                                    Escolher Foto
                                </span>
                            </label>
                            <p className="text-xs text-slate-400 mt-2">JPG, PNG ou WEBP (máx. 2MB)</p>
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}`}>
                                <span className="material-icons text-sm">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cargo/Função</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                    placeholder="Ex: Veterinário, Atendente, Gerente"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 shadow-sm sm:text-sm py-2.5 px-3 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-slate-400">O email não pode ser alterado por aqui.</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading || uploading ? (
                                <>
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    {uploading ? 'Enviando foto...' : 'Salvando...'}
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PerfilUsuario;
