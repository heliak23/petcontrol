
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: 'male' | 'female';
  image_url: string;
}

interface Cliente {
  id: string;
  name: string;
  phone: string;
  email: string;
  initials: string;
  pets: Pet[];
}

const ClientesPets: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select(`
          *,
          pets (*)
        `)
        .order('name');

      if (error) throw error;

      const formattedClientes = data.map((c: any) => ({
        ...c,
        initials: c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
        pets: c.pets || []
      }));

      setClientes(formattedClientes);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja excluir este cliente e todos os seus pets?')) return;

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClientes(clientes.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Error deleting client:', err);
      alert('Erro ao excluir cliente.');
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      setClientes(prevClientes =>
        prevClientes.map(c => ({
          ...c,
          pets: c.pets.filter(p => p.id !== petId)
        }))
      );
    } catch (err: any) {
      console.error('Error deleting pet:', err);
      alert('Erro ao excluir pet.');
    }
  };

  const filteredClientes = clientes.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Clientes e Pets</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie a base de clientes e seus animais de estimação.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-slate-400 text-xl group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              className="block w-full sm:w-64 pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-surface-dark placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow shadow-sm"
              placeholder="Buscar por nome, telefone..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate('/novo-cliente')}
            className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-[1.02]"
          >
            <span className="material-icons text-lg mr-2">person_add</span>
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Tabs removed */}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-500">Carregando clientes...</p>
        </div>
      ) : filteredClientes.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-3xl text-slate-400">person_off</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum cliente encontrado</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{searchTerm ? `Nenhum resultado para "${searchTerm}"` : 'Comece cadastrando seu primeiro cliente.'}</p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/novo-cliente')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
            >
              <span className="material-icons">add</span>
              Cadastrar Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredClientes.map(client => (
            <div key={client.id} className={`bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ${expandedId === client.id ? 'ring-1 ring-primary/20' : 'hover:shadow-md'}`}>
              <div
                onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg bg-primary/10 text-primary`}>
                    {client.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{client.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><i className="material-icons text-base">phone</i> {client.phone || 'Sem telefone'}</span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
                      <span className="flex items-center gap-1"><i className="material-icons text-base">email</i> {client.email || 'Sem e-mail'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className={`text-xs font-medium px-2 py-1 rounded text-center mr-2 ${client.pets.length === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {client.pets.length === 0 ? 'Sem Pets' : `${client.pets.length} Pet${client.pets.length > 1 ? 's' : ''}`}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editar-cliente/${client.id}`);
                    }}
                    className="text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-1"
                  >
                    <span className="material-icons text-base">edit</span> Editar
                  </button>

                  <button
                    onClick={(e) => deleteClient(client.id, e)}
                    className="text-sm font-medium text-red-500 hover:text-red-700 dark:hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1"
                    title="Excluir Cliente"
                  >
                    <span className="material-icons text-base">delete</span> Excluir
                  </button>

                  <span className={`material-icons text-slate-400 transition-transform ${expandedId === client.id ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </div>
              </div>

              {expandedId === client.id && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pets Cadastrados ({client.pets.length})</h4>
                    <button
                      onClick={() => navigate(`/novo-pet/${client.id}`)}
                      className="text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wide flex items-center gap-1 px-3 py-1.5 rounded border border-primary/20 hover:bg-primary/5 transition-colors"
                    >
                      <span className="material-icons text-sm">add</span> Adicionar Pet
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {client.pets.map(pet => (
                      <div key={pet.id} className="bg-white dark:bg-surface-dark rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex gap-4 group hover:border-primary/50 transition-all">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 relative">
                          <img alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={pet.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'} />
                          <div className="absolute inset-0 bg-black/5 dark:bg-black/20"></div>
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h5 className="font-bold text-slate-800 dark:text-slate-100">{pet.name}</h5>
                              <span className={`material-icons text-lg ${pet.gender === 'male' ? 'text-primary/40' : 'text-pink-400/60'}`}>
                                {pet.gender === 'male' ? 'male' : 'female'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pet.breed || 'SRD'}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{pet.age || 'N/A'} • {pet.weight || 'N/A'}</p>
                          </div>
                          <div className="flex gap-2 mt-3 items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/editar-pet/${pet.id}`);
                              }}
                              className="text-xs font-medium text-primary hover:text-primary-dark bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded transition-colors w-full text-center"
                            >
                              Ver Perfil
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('Tem certeza que deseja excluir este pet?')) {
                                  await deletePet(pet.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                              title="Excluir Pet"
                            >
                              <span className="material-icons text-base">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => navigate(`/novo-pet/${client.id}`)}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <span className="material-icons text-xl">add</span>
                      </div>
                      <span className="text-xs font-medium">Novo Pet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientesPets;
