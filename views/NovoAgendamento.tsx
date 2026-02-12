
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';
import { useAuth } from '../src/context/AuthContext';

interface Service {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

interface Pet {
  id: string;
  name: string;
  cliente: {
    name: string;
  };
}

const NovoAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [time, setTime] = useState('14:00 - 15:00');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchServicesAndAppointment = async () => {
      // Fetch Services
      const { data: servicesData } = await supabase.from('servicos').select('*');
      setServices(servicesData || []);

      // If ID is present, fetch Appointment details
      if (id) {
        setIsEditing(true);
        setLoading(true);
        const { data: appointment, error } = await supabase
          .from('agendamentos')
          .select(`
            *,
            pet:pets (id, name, cliente:clientes(name))
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar agendamento:', error);
          navigate('/agendamentos');
          return;
        }

        if (appointment) {
          setSelectedPetId(appointment.pet_id);
          setSelectedServiceId(appointment.servico_id);
          setDate(appointment.date.split('T')[0]);
          setTime(appointment.time);
          if (appointment.pet) {
            setSearchTerm(appointment.pet.name);
          }
        }
        setLoading(false);
      }
    };
    fetchServicesAndAppointment();
  }, [id, navigate]);

  useEffect(() => {
    const fetchPets = async () => {
      if (searchTerm.length > 2) {
        const { data: petsData } = await supabase
          .from('pets')
          .select('id, name, cliente:clientes(name)')
          .ilike('name', `%${searchTerm}%`);
        setPets(petsData as any || []);
      }
    };
    fetchPets();
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !selectedServiceId) {
      alert('Por favor, selecione um pet e um serviço.');
      return;
    }

    try {
      setLoading(true);
      const professionalName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Profissional';
      const professionalInitials = professionalName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

      const appointmentData = {
        pet_id: selectedPetId,
        servico_id: selectedServiceId,
        date,
        time,
        professional: professionalName,
        professional_initials: professionalInitials,
        status: 'Pendente'
      };

      let error;
      if (isEditing && id) {
        // Update
        const { error: updateError } = await supabase
          .from('agendamentos')
          .update({
            pet_id: selectedPetId,
            servico_id: selectedServiceId,
            date,
            time
            // Don't update status or professional here usually unless form allows
          })
          .eq('id', id);
        error = updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('agendamentos')
          .insert([appointmentData]);
        error = insertError;
      }

      if (error) throw error;
      navigate('/agendamentos');
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  const serviceIcons: Record<string, string> = {
    'Banho': 'shower',
    'Banho & Tosa': 'content_cut',
    'Consulta': 'medical_services',
    'Vacinação': 'vaccine'
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
        >
          <span className="material-icons">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Editar Agendamento' : 'Cadastrar Novo Agendamento'}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{isEditing ? 'Atualize as informações do agendamento abaixo.' : 'Preencha as informações abaixo para agendar um serviço.'}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <form className="divide-y divide-slate-100 dark:divide-slate-800" onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                <span className="material-icons text-lg">pets</span>
              </span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dados do Pet</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">Pesquisar Pet / Cliente</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-slate-400 text-lg">search</span>
                  </div>
                  <input
                    className="block w-full rounded-lg border-slate-300 py-3 pl-10 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    placeholder="Digite o nome do pet para buscar..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {pets.length > 0 && searchTerm.length > 2 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {pets.map(pet => (
                        <div
                          key={pet.id}
                          className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center ${selectedPetId === pet.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                          onClick={() => { setSelectedPetId(pet.id); setSearchTerm(pet.name); setPets([]); }}
                        >
                          <div>
                            <p className="font-medium dark:text-white">{pet.name}</p>
                            <p className="text-xs text-slate-500">{pet.cliente?.name}</p>
                          </div>
                          {selectedPetId === pet.id && <span className="material-icons text-primary text-sm">check_circle</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">Serviço</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {services.map(s => (
                    <label key={s.id} className={`cursor-pointer relative flex flex-col items-center justify-center rounded-lg border p-4 shadow-sm transition-all group ${selectedServiceId === s.id ? 'border-primary ring-1 ring-primary' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary hover:ring-1 hover:ring-primary'}`}>
                      <input
                        type="radio"
                        name="service"
                        className="sr-only"
                        checked={selectedServiceId === s.id}
                        onChange={() => setSelectedServiceId(s.id)}
                      />
                      <span className={`material-icons mb-2 text-2xl transition-colors ${selectedServiceId === s.id ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>{serviceIcons[s.name] || 'info'}</span>
                      <span className={`text-sm font-medium ${selectedServiceId === s.id ? 'text-primary dark:text-primary-light' : 'text-slate-900 dark:text-white group-hover:text-primary'}`}>{s.name}</span>
                      {selectedServiceId === s.id && <span className="material-icons absolute top-2 right-2 text-primary text-base">check_circle</span>}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                <span className="material-icons text-lg">calendar_month</span>
              </span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Informações de Data e Horário</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-3">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-3">Horário Disponível</label>
                <div className="relative">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 py-3 pl-10 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="07:00 - 08:00">07:00 - 08:00</option>
                    <option value="08:00 - 09:00">08:00 - 09:00</option>
                    <option value="09:00 - 10:00">09:00 - 10:00</option>
                    <option value="10:00 - 11:00">10:00 - 11:00</option>
                    <option value="11:00 - 12:00">11:00 - 12:00</option>
                    <option value="12:00 - 13:00">12:00 - 13:00</option>
                    <option value="13:00 - 14:00">13:00 - 14:00</option>
                    <option value="14:00 - 15:00">14:00 - 15:00</option>
                    <option value="15:00 - 16:00">15:00 - 16:00</option>
                    <option value="16:00 - 17:00">16:00 - 17:00</option>
                    <option value="17:00 - 18:00">17:00 - 18:00</option>
                    <option value="18:00 - 19:00">18:00 - 19:00</option>
                    <option value="19:00 - 20:00">19:00 - 20:00</option>
                  </select>
                  <span className="material-icons absolute left-3 top-3 text-slate-400">schedule</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 px-8 py-5 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-icons text-sm">{loading ? 'sync' : 'check'}</span>
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar Agendamento' : 'Salvar Agendamento')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoAgendamento;
