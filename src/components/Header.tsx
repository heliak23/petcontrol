
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Don't show header on login page
  if (location.pathname === '/login') return null;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-primary/10 dark:border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-icons text-primary text-3xl">pets</span>
            <span className="font-bold text-xl tracking-tight text-cyan-600 dark:text-cyan-400">PetControl</span>
          </div>

          <nav className="hidden md:flex space-x-8 h-full items-center">
            <Link to="/" className={`font-medium px-3 py-2 text-sm transition-colors border-b-2 h-full flex items-center ${isActive('/') ? 'text-primary border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary border-transparent'}`}>
              Visão Geral
            </Link>
            <Link to="/agendamentos" className={`font-medium px-3 py-2 text-sm transition-colors border-b-2 h-full flex items-center ${isActive('/agendamentos') ? 'text-primary border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary border-transparent'}`}>
              Agendamentos
            </Link>
            <Link to="/servicos" className={`font-medium px-3 py-2 text-sm transition-colors border-b-2 h-full flex items-center ${isActive('/servicos') ? 'text-primary border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary border-transparent'}`}>
              Serviços
            </Link>
            <Link to="/produtos" className={`font-medium px-3 py-2 text-sm transition-colors border-b-2 h-full flex items-center ${isActive('/produtos') ? 'text-primary border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary border-transparent'}`}>
              Produtos
            </Link>
            <Link to="/clientes" className={`font-medium px-3 py-2 text-sm transition-colors border-b-2 h-full flex items-center ${isActive('/clientes') ? 'text-primary border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary border-transparent'}`}>
              Clientes & Pets
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
              title="Sair"
            >
              <span className="material-icons text-xl">logout</span>
            </button>

            <button
              type="button"
              onClick={() => {
                console.log('Navigating to profile...');
                navigate('/perfil');
              }}
              className="relative group block cursor-pointer focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden ring-2 ring-offset-2 ring-primary/20 ring-offset-background-light dark:ring-offset-background-dark group-hover:ring-primary transition-all">
                {user?.user_metadata?.avatar_url ? (
                  <img alt="User" className="h-full w-full object-cover" src={user.user_metadata.avatar_url} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary text-white text-xs font-bold">
                    {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-icons text-2xl">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark/95 backdrop-blur-md absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Visão Geral</Link>
            <Link to="/agendamentos" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/agendamentos') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Agendamentos</Link>
            <Link to="/servicos" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/servicos') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Serviços</Link>
            <Link to="/produtos" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/produtos') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Produtos</Link>
            <Link to="/clientes" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/clientes') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Clientes & Pets</Link>
            <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
