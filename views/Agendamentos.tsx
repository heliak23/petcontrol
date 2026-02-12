
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';
import { AppointmentStatus } from '../types';

interface AppointmentWithDetails {
  id: string;
  pet_id: string;
  servico_id: string;
  date: string;
  time: string;
  professional: string;
  professional_initials: string;
  status: string;
  pet: {
    name: string;
    image_url: string;
    cliente: {
      name: string;
    }
  };
  servico: {
    name: string;
  };
}

const Agendamentos: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todos');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          pet:pets (
            name,
            image_url,
            cliente:clientes (name)
          ),
          servico:servicos (name)
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;
    try {
      const { error } = await supabase.from('agendamentos').delete().eq('id', id);
      if (error) throw error;
      setAppointments(prev => prev.filter(apt => apt.id !== id));
      setOpenMenuId(null);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir agendamento.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
      setOpenMenuId(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status.');
    }
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;

    // Filter by tab
    switch (activeTab) {
      case 'Pendentes':
        filtered = filtered.filter(apt => apt.status === 'Pendente');
        break;
      case 'Concluídos':
        filtered = filtered.filter(apt => apt.status === 'Concluído' || apt.status === 'Confirmado');
        break;
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.pet.name.toLowerCase().includes(search) ||
        apt.pet.cliente.name.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmado': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'Concluído': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'Pendente': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'Cancelado': return 'bg-red-50 text-red-700 ring-red-600/20';
      default: return 'bg-slate-50 text-slate-700 ring-slate-600/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div onClick={() => setOpenMenuId(null)}>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Agendamentos</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Gerencie os horários e serviços do dia a dia.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-icons text-slate-400 text-lg">search</span>
            </div>
            <input
              className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-800 dark:ring-slate-700 dark:text-white"
              placeholder="Buscar pet ou cliente..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate('/novo-agendamento')}
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-all"
          >
            <span className="material-icons text-sm">add</span>
            Novo Agendamento
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
        <nav className="-mb-px flex space-x-8">
          {['Todos', 'Pendentes', 'Concluídos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:pl-6">Pet / Cliente</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Serviço</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Data e Hora</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Profissional</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {apt.pet?.image_url ? (
                            <img src={apt.pet.image_url} className="h-10 w-10 rounded-full object-cover border border-slate-200" alt={apt.pet.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <span className="material-icons text-xl">pets</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-slate-900 dark:text-white">{apt.pet?.name}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-sm">{apt.pet?.cliente?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {apt.servico?.name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {(() => {
                            const [year, month, day] = apt.date.split('T')[0].split('-').map(Number);
                            return new Date(year, month - 1, day).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                          })()}
                        </span>
                        <span className="text-xs text-slate-500">{apt.time}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${apt.professional_initials === 'JP' ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'}`}>
                          {apt.professional_initials || '??'}
                        </div>
                        <span>{apt.professional || 'Não designado'}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusStyle(apt.status)}`}>
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${apt.status === 'Confirmado' ? 'bg-emerald-600' : apt.status === 'Concluído' ? 'bg-blue-600' : apt.status === 'Pendente' ? 'bg-amber-600' : 'bg-red-600'}`}></span>
                        {apt.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(apt.id); }}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Excluir"
                        >
                          <span className="material-icons text-xl">delete</span>
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === apt.id ? null : apt.id); }}
                            className="text-slate-400 hover:text-primary transition-colors p-1"
                          >
                            <span className="material-icons text-xl">more_vert</span>
                          </button>
                          {openMenuId === apt.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu">
                                <button
                                  onClick={(e) => { e.stopPropagation(); navigate(`/editar-agendamento/${apt.id}`); }}
                                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                  role="menuitem"
                                >
                                  <span className="material-icons text-base">edit</span>
                                  Editar
                                </button>
                                {apt.status !== 'Concluído' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(apt.id, 'Concluído'); }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                    role="menuitem"
                                  >
                                    <span className="material-icons text-base">check_circle</span>
                                    Concluir
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum agendamento encontrado nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div><p className="text-sm text-slate-700 dark:text-slate-400">Mostrando <span className="font-medium">{filteredAppointments.length}</span> resultados</p></div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"><span className="material-icons text-sm">chevron_left</span></button>
              <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white">1</button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"><span className="material-icons text-sm">chevron_right</span></button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;
