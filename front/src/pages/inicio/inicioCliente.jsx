import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarro } from '../../context/CarroContext';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../components/sidebar';
import VehiculoCard from '../components/VehiculoCard';
import CitaClienteCard from '../components/CitaClienteCard';
import { Car, User, Phone, Calendar, Clock, Star, BookOpen, Plus } from 'lucide-react';

const InicioCliente = () => {
  const { cliente, setCliente } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { deleteCarros } = useCarro();
  const { isDarkMode } = useTheme();
  
  const [vehiculosCliente, setVehiculosCliente] = useState([]);
  const [citasCliente, setCitasCliente] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Try to get data from navigation state first
        const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData'));
        
        if (userData) {
          setCliente(userData);
          setVehiculosCliente(userData.carros || []);
          setCitasCliente(userData.citas?.filter(cita => 
            cita.estado === 'programada' || cita.estado === 'en_proceso'
          ) || []);
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Error al cargar los datos iniciales');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setCliente, location.state]);

  // Update data when client changes
  useEffect(() => {
    if (cliente) {
      setVehiculosCliente(cliente.carros || []);
      setCitasCliente(cliente.citas?.filter(cita => 
        cita.estado === 'programada' || cita.estado === 'en_proceso'
      ) || []);
    }
  }, [cliente]);

  const handleDeleteVehiculo = async (id) => {
    try {
      await deleteCarros(id);
      setVehiculosCliente(prev => prev.filter(vehiculo => vehiculo._id !== id));
    } catch (err) {
      setError('No se pudo eliminar el vehículo');
      console.error('Error al eliminar vehículo:', err);
    }
  };

  // Add error clearing function
  const clearError = () => setError(null);

  // Evita agendar cita si no hay vehículos registrados
  const handleAgendarCita = () => {
    if (!vehiculosCliente || vehiculosCliente.length === 0) {
      setError('Debes registrar al menos un vehículo antes de agendar una cita.');
      setTimeout(() => setError(null), 4000);
      return;
    }
    navigate('/agregarCita');
  };
  
  // Error display with dismissal
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-xl rounded-xl border border-red-500/20 p-8 max-w-md w-full mx-4">
          <div className="text-red-500 text-center mb-4">{error}</div>
          <button
            onClick={clearError}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-gray-200'
    }`}>
      <Sidebar onHover={(isOpen) => setIsSidebarOpen(isOpen)} />
      
      {/* Ajuste: usar style marginLeft dinámico para que el contenido se desplace completamente cuando el sidebar se abre */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? 320 : 80 }} // 320px para abrir completamente (ajusta si tu sidebar tiene otro ancho)
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <header className="max-w-7xl mx-auto mb-6">
            <div className={`${
              isDarkMode 
                ? 'bg-black/40 border-white/10' 
                : 'bg-white/80 border-gray-200'
            } backdrop-blur-xl rounded-2xl border overflow-hidden`}>
              <div className="relative p-8">
                {/* Content */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <h1 className={`text-4xl font-black mb-2 tracking-tight ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Hola, {cliente?.nombre?.split(' ')[0] || 'Usuario'}
                      </h1>
                      <p className={`${isDarkMode ? 'text-white/70' : 'text-gray-600'} text-lg`}>
                        ¿Qué te gustaría hacer hoy?
                      </p>

                      {/* Mini info row: vehículos y citas */}
                      <div className="mt-4 flex items-center justify-center md:justify-start gap-4">
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} border`}>
                          <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Vehículos
                          </div>
                          <div className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vehiculosCliente?.length || 0}
                          </div>
                        </div>

                        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} border`}>
                          <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Citas activas
                          </div>
                          <div className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {citasCliente?.length || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-4">
                      <button onClick={() => navigate('/agregarCarro')} 
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200'
                        } border`}>
                        <Plus className="w-5 h-5" />
                        <span>Agregar Carro</span>
                      </button>

                      <button
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200'
                        } border ${(!vehiculosCliente || vehiculosCliente.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleAgendarCita}
                        disabled={!vehiculosCliente || vehiculosCliente.length === 0}
                        aria-disabled={!vehiculosCliente || vehiculosCliente.length === 0}
                      >
                        <Clock className="w-5 h-5" />
                        <span>Agendar Cita</span>
                      </button>

                      <button onClick={() => navigate('/planes')}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                        <Star className="w-5 h-5" />
                        <span>Ver Promociones</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>


          {/* Vehicles Section */}
          <section className="max-w-7xl mx-auto mb-16">
            <div className="text-center md:text-left mb-8">
              <h2 className={`text-3xl font-black mb-2 tracking-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                MIS VEHÍCULOS
              </h2>
              <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>
                {vehiculosCliente.length > 0 
                  ? "Tus vehículos registrados" 
                  : "No tienes vehículos registrados"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {vehiculosCliente.map((vehiculo) => (
                <VehiculoCard 
                  key={vehiculo._id}
                  vehiculo={vehiculo} 
                  onDelete={handleDeleteVehiculo}
                />
              ))}
            </div>
          </section>

          {/* Appointments Section */}
          <section className="max-w-7xl mx-auto mb-16">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                PRÓXIMAS CITAS
              </h2>
              <p className="text-white/70">
                {citasCliente.length > 0 
                  ? "Tus citas programadas" 
                  : "No tienes citas programadas"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {citasCliente.map((cita) => (
                <CitaClienteCard 
                  key={cita._id} 
                  cita={cita}
                />
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default InicioCliente;