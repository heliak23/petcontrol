
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// Views
import Dashboard from './views/Dashboard';
import ClientesPets from './views/ClientesPets';
import Agendamentos from './views/Agendamentos';
import Servicos from './views/Servicos';
import Produtos from './views/Produtos';
import NovoAgendamento from './views/NovoAgendamento';
import NovoCliente from './views/NovoCliente';
import NovoPet from './views/NovoPet';
import NovoProduto from './views/NovoProduto';
import NovoServico from './views/NovoServico';
import PerfilUsuario from './views/PerfilUsuario';
import Login from './views/Login';
import SignUp from './views/SignUp';

import Layout from './components/Layout';

import { AuthProvider } from './src/context/AuthContext';
import ProtectedRoute from './src/components/ProtectedRoute';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-display transition-colors duration-200 bg-background-light dark:bg-background-dark">
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/clientes" element={
                <ProtectedRoute>
                  <ClientesPets />
                </ProtectedRoute>
              } />
              <Route path="/agendamentos" element={
                <ProtectedRoute>
                  <Agendamentos />
                </ProtectedRoute>
              } />
              <Route path="/servicos" element={
                <ProtectedRoute>
                  <Servicos />
                </ProtectedRoute>
              } />
              <Route path="/produtos" element={
                <ProtectedRoute>
                  <Produtos />
                </ProtectedRoute>
              } />
              <Route path="/novo-agendamento" element={
                <ProtectedRoute>
                  <NovoAgendamento />
                </ProtectedRoute>
              } />
              <Route path="/editar-agendamento/:id" element={
                <ProtectedRoute>
                  <NovoAgendamento />
                </ProtectedRoute>
              } />
              <Route path="/novo-cliente" element={
                <ProtectedRoute>
                  <NovoCliente />
                </ProtectedRoute>
              } />
              <Route path="/editar-cliente/:id" element={
                <ProtectedRoute>
                  <NovoCliente />
                </ProtectedRoute>
              } />
              <Route path="/novo-pet/:clientId" element={
                <ProtectedRoute>
                  <NovoPet />
                </ProtectedRoute>
              } />
              <Route path="/editar-pet/:petId" element={
                <ProtectedRoute>
                  <NovoPet />
                </ProtectedRoute>
              } />
              <Route path="/novo-produto" element={
                <ProtectedRoute>
                  <NovoProduto />
                </ProtectedRoute>
              } />
              <Route path="/novo-servico" element={
                <ProtectedRoute>
                  <NovoServico />
                </ProtectedRoute>
              } />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <PerfilUsuario />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>

          {/* Floating Theme Toggle for demo purposes */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white dark:bg-surface-dark shadow-xl border border-primary/20 text-primary flex items-center justify-center hover:scale-110 transition-transform"
          >
            <span className="material-icons">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
