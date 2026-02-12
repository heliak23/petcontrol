
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';

interface Appointment {
  id: string;
  servico: { name: string };
  pet: { name: string };
  time: string;
  date: string;
}

interface PetPhoto {
  id: string;
  image_url: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalPets, setTotalPets] = useState(0);
  const [petPhotos, setPetPhotos] = useState<PetPhoto[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent appointments
      const { data: appointmentsData } = await supabase
        .from('agendamentos')
        .select(`
          id,
          time,
          date,
          pet:pets(name),
          servico:servicos(name)
        `)
        .order('date', { ascending: true })
        .limit(3);

      // Fetch total pets count and photos
      const { data: petsData, count } = await supabase
        .from('pets')
        .select('id, image_url', { count: 'exact' })
        .limit(4);

      // Fetch services
      const { data: servicesData } = await supabase
        .from('servicos')
        .select('id, name, category, price')
        .limit(4);

      setAppointments(appointmentsData || []);
      setTotalPets(count || 0);
      setPetPhotos(petsData || []);
      setServices(servicesData || []);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName?.toLowerCase().includes('vacina')) return 'vaccines';
    if (serviceName?.toLowerCase().includes('tosa') || serviceName?.toLowerCase().includes('banho')) return 'content_cut';
    if (serviceName?.toLowerCase().includes('consulta')) return 'medical_services';
    return 'pets';
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-primary/10 dark:border-primary/20 overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 px-8 py-12 md:py-16 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-6">
              <span className="material-icons text-sm">star</span> Nova funcionalidade de Agenda
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Gerencie todos os serviços do seu pet <span className="text-primary">em um só lugar!</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg">
              Controle agendamentos, histórico veterinário e estoque de produtos com facilidade e eficiência.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/novo-agendamento')}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-lg font-medium shadow-lg shadow-primary/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span className="material-icons">add_circle_outline</span>
                Criar seu primeiro agendamento
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl transform rotate-12 scale-90"></div>
              <img alt="Happy dog" className="relative w-full h-full object-cover rounded-2xl shadow-2xl rotate-3 border-4 border-white dark:border-surface-dark transform hover:rotate-0 transition-transform duration-500" src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=612&q=80" />
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-surface-dark p-4 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <span className="material-icons text-green-600 dark:text-green-400">check_circle</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Pet Seguro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Agendamentos Recentes */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Agendamentos Recentes</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Próximos compromissos</p>
            </div>
            <button onClick={() => navigate('/agendamentos')} className="text-primary hover:text-primary-dark p-2 rounded-full hover:bg-primary/5 transition-colors">
              <span className="material-icons">calendar_today</span>
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : appointments.length > 0 ? (
              appointments.map(apt => (
                <div key={apt.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons">{getServiceIcon(apt.servico?.name)}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm group-hover:text-primary transition-colors">{apt.servico?.name || 'Serviço'}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{apt.pet?.name || 'Pet'}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">{apt.time}</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mt-1">
                      {new Date(apt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-sm py-8">Nenhum agendamento encontrado</p>
            )}
          </div>
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link to="/agendamentos" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center justify-center gap-1 group">
              Ver todos agendamentos
              <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Pets Ativos */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full"></div>
          <div className="mb-4 relative z-10">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Pets Ativos</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Base de clientes atual</p>
          </div>
          <div className="flex items-baseline gap-2 mb-6 relative z-10">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : (
              <>
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{totalPets}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">pets cadastrados</span>
              </>
            )}
          </div>
          <div className="flex -space-x-3 mb-8 px-2 relative z-10">
            {!loading && totalPets > 0 && (
              <>
                {petPhotos.map((pet) => (
                  pet.image_url ? (
                    <img key={pet.id} alt="Pet" className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark object-cover" src={pet.image_url} />
                  ) : (
                    <div key={pet.id} className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <span className="material-icons text-slate-400 text-sm">pets</span>
                    </div>
                  )
                ))}
                {totalPets > 4 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                    +{totalPets - 4}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

        {/* Serviços Cadastrados */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Serviços</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Catálogo de serviços</p>
            </div>
            <button onClick={() => navigate('/servicos')} className="text-primary hover:text-primary-dark p-2 rounded-full hover:bg-primary/5 transition-colors">
              <span className="material-icons">list_alt</span>
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-sm">spa</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{service.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{service.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">R$ {service.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-sm py-8">Nenhum serviço cadastrado</p>
            )}
          </div>
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => navigate('/servicos')}
              className="w-full py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Ver todos os serviços
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
