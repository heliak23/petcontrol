
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';
import { Service } from '../types';

const Servicos: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('name');

      if (error) throw error;

      // Map database fields to frontend interface
      const formattedServices: Service[] = (data || []).map(s => ({
        ...s,
        image: s.image_url
      }));

      setServices(formattedServices);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
            <span>Gestão</span>
            <span className="material-icons text-[14px]">chevron_right</span>
            <span className="text-primary font-medium">Serviços e Pacotes</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Catálogo de Serviços</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie os serviços oferecidos no seu estabelecimento.</p>
        </div>
        <button
          onClick={() => navigate('/novo-servico')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all font-medium shadow-md shadow-primary/20"
        >
          <span className="material-icons">add</span>
          Adicionar Serviço
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[
          { icon: 'content_cut', label: 'Total de Serviços', val: services.length.toString(), color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: 'trending_up', label: 'Serviço Mais Vendido', val: 'Banho Premium', color: 'text-green-500', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${stat.bg} dark:bg-opacity-10 ${stat.color} flex items-center justify-center`}>
              <span className="material-icons">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          Serviços Individuais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(service => (
            <div key={service.id} className="group bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-primary"><span className="material-icons text-sm">edit</span></button>
              </div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-orange-100 dark:bg-orange-900/30 overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover opacity-90" src={service.image || 'https://via.placeholder.com/200'} alt={service.name} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">{service.name}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">{service.category}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="material-icons text-base">schedule</span>
                  <span className="text-sm font-medium">{service.duration}</span>
                </div>
                <span className="text-lg font-bold text-primary">R$ {service.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              Nenhum serviço cadastrado.
            </div>
          )}
        </div>
      </section>


    </div>
  );
};

export default Servicos;
