
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            setLoading(false);
            return;
        }

        const { error } = await signUp(email, password);

        if (error) {
            setError(error.message || 'Erro ao criar conta.');
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-background-light text-slate-800 min-h-screen flex items-center justify-center font-display p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons text-3xl">check</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Conta criada com sucesso!</h2>
                    <p className="text-slate-600 mb-8">Por favor, verifique seu e-mail para confirmar seu cadastro antes de fazer login.</p>
                    <Link to="/login" className="block w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors">
                        Ir para Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light text-slate-800 min-h-screen flex font-display antialiased">
            <div className="hidden lg:flex w-1/2 relative bg-surface-dark overflow-hidden">
                <div className="absolute inset-0 bg-primary/40 z-10 mix-blend-multiply"></div>
                <img alt="Pets friends" className="absolute inset-0 h-full w-full object-cover opacity-90" src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80" />
                <div className="relative z-20 flex flex-col justify-end p-16 h-full w-full text-white">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-lg mb-6">
                            <span className="material-icons text-3xl">pets</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Junte-se à nossa<br />comunidade.</h2>
                        <p className="text-lg text-white/90 max-w-md">Comece a gerenciar os serviços do seu pet hoje mesmo.</p>
                    </div>
                    <div className="text-sm text-white/60">© 2026 PetControl, Heliak Rocha</div>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background-light">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-8 lg:hidden">
                            <span className="material-icons text-primary text-3xl">pets</span>
                            <span className="font-bold text-xl tracking-tight text-cyan-600">PetControl</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Crie sua conta</h1>
                        <p className="mt-2 text-sm text-slate-500">Preencha os dados abaixo para começar.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <span className="material-icons text-base">error_outline</span>
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="email">E-mail</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    id="email"
                                    placeholder="nome@exemplo.com"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="password">Senha</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    id="password"
                                    required
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">Confirmar Senha</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    id="confirmPassword"
                                    required
                                    type="password"
                                    placeholder="Confirme sua senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Criando conta...
                                </span>
                            ) : 'Criar conta'}
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-600">
                            Já tem uma conta?
                            <Link to="/login" className="ml-1 font-medium text-primary hover:text-primary-dark hover:underline">Fazer Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
