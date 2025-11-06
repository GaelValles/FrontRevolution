import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarro } from '../../context/CarroContext';
import Sidebar from '../components/sidebar';
import VehiculoCard from '../components/VehiculoCard';
import CitaClienteCard from '../components/CitaClienteCard';
import { Car, User, Phone, Calendar, Clock, Star, BookOpen, Plus } from 'lucide-react';

const InicioCliente = () => {
  const { cliente } = useAuth();
  const navigate = useNavigate();
  const { deleteCarros } = useCarro(); // Add this import
  
  const [vehiculosCliente, setVehiculosCliente] = useState([]);
  const [citasCliente, setCitasCliente] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    try {
      if (cliente?.carros && Array.isArray(cliente.carros)) {
        setVehiculosCliente(cliente.carros);
      }
      
      if (cliente?.citas && Array.isArray(cliente.citas)) {
        const citasActivas = cliente.citas.filter(cita => 
          cita.estado === 'programada' || cita.estado === 'en_proceso'
        );
        setCitasCliente(citasActivas);
      }
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error en useEffect:', err);
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Sidebar onHover={(isOpen) => setIsSidebarOpen(isOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'
      }`}>
        <div className="p-6 md:p-8">
          {/* New Header Design */}
          <header className="max-w-7xl mx-auto mb-12">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <div className="relative p-8">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-2xl rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

                {/* Content */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Welcome Message */}
                    <div className="text-center md:text-left">
                      <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        Hola, {cliente?.nombre?.split(' ')[0] || 'Usuario'}
                      </h1>
                      <p className="text-white/70 text-lg">
                        ¿Qué te gustaría hacer hoy?
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-4">
                      <button onClick={() => navigate('/agregar-cita')} 
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                        <Clock className="w-5 h-5" />
                        <span>Agendar Cita</span>
                      </button>
                      <button onClick={() => navigate('/planes-promociones')}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                        <Star className="w-5 h-5" />
                        <span>Ver Promociones</span>
                      </button>
                    </div>
                  </div>

                    {/* Add more overview cards as needed */}
                  
                </div>
              </div>
            </div>
          </header>


          {/* Vehicles Section */}
          <section className="max-w-7xl mx-auto mb-16">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                MIS VEHÍCULOS
              </h2>
              <p className="text-white/70">
                {vehiculosCliente.length > 0 
                  ? "Tus vehículos registrados" 
                  : "No tienes vehículos registrados"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {vehiculosCliente.map((vehiculo) => (
                <VehiculoCard 
                  key={vehiculo._id}
                  vehiculo={vehiculo} // Pasar el objeto completo
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
                  cita={cita} // Ya estábamos pasando el objeto completo
                />
              ))}
            </div>
          </section>

          {/* Stats Footer */}
          <footer className="max-w-7xl mx-auto mt-16">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <User className="w-6 h-6 text-white/60 mx-auto mb-2" />
                  <div className="text-white/60 text-xs uppercase tracking-wider">CLIENTE DESDE</div>
                  <div className="text-white font-bold">2024</div>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <Car className="w-6 h-6 text-white/60 mx-auto mb-2" />
                  <div className="text-white/60 text-xs uppercase tracking-wider">VEHÍCULOS</div>
                  <div className="text-white font-bold">{vehiculosCliente?.length || 0}</div>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <Calendar className="w-6 h-6 text-white/60 mx-auto mb-2" />
                  <div className="text-white/60 text-xs uppercase tracking-wider">CITAS ACTIVAS</div>
                  <div className="text-white font-bold">{citasCliente?.length || 0}</div>
                </div>

                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <Star className="w-6 h-6 text-white/60 mx-auto mb-2" />
                  <div className="text-white/60 text-xs uppercase tracking-wider">MEMBRESÍA</div>
                  <div className="text-white font-bold">Premium</div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default InicioCliente;