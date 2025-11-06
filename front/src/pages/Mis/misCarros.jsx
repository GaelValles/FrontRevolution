import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarro } from '../../context/CarroContext';
import Sidebar from '../components/sidebar';
import { Car, Filter, Plus, Search, Settings2, Info, Trash2 } from 'lucide-react';

const MisCarros = () => {
  const navigate = useNavigate();
  const { cliente } = useAuth();
  const { getCarroById, deleteCarros } = useCarro();
  const [vehiculos, setVehiculos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehiculos = async () => {
      if (cliente?.carros) {
        try {
          setLoading(true);
          // Extraer solo los IDs si carros contiene objetos completos
          const carroIds = cliente.carros.map(carro => 
            typeof carro === 'string' ? carro : carro._id
          );
          
          console.log('IDs de carros:', carroIds); // Para debugging
          
          const vehiculosPromises = carroIds.map(id => getCarroById(id));
          const vehiculosData = await Promise.all(vehiculosPromises);
          setVehiculos(vehiculosData.filter(v => v !== null));
        } catch (error) {
          console.error('Error al obtener vehículos:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVehiculos();
  }, [cliente, getCarroById]);

  const handleDeleteVehiculo = async (id) => {
    try {
      await deleteCarros(id);
      setVehiculos(prev => prev.filter(vehiculo => vehiculo !== id));
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Sidebar onHover={(isOpen) => setIsSidebarOpen(isOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'
      }`}>
        <div className="p-6 md:p-8">
          {/* Header */}
          <header className="max-w-7xl mx-auto mb-12">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                    Mis Vehículos
                  </h1>
                  <p className="text-white/70">
                    Gestiona y visualiza todos tus vehículos registrados
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/agregarCarro')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <Plus className="w-5 h-5" />
                  <span>Agregar Nuevo Vehículo</span>
                </button>
              </div>

              {/* Search and Filter Bar */}
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por marca, modelo o placas..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFiltroActivo('todos')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'todos'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFiltroActivo('carros')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'carros'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    Carros
                  </button>
                  <button
                    onClick={() => setFiltroActivo('camionetas')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'camionetas'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    Camionetas
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Vehículos Grid */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((skeleton) => (
                  <div key={skeleton} className="animate-pulse bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                    <div className="h-8 bg-white/5 rounded-lg w-3/4 mb-4"></div>
                    <div className="h-6 bg-white/5 rounded-lg w-1/2 mb-8"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-10 bg-white/5 rounded-lg"></div>
                      <div className="h-10 bg-white/5 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : vehiculos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vehiculos.map((vehiculo) => (
                  <div key={vehiculo._id} className="group bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-500">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-white mb-2">
                          {vehiculo.marca} {vehiculo.modelo}
                        </h3>
                        <p className="text-white/60">{vehiculo.placas}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/editar-carro/${vehiculo._id}`)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
                        >
                          <Settings2 className="w-5 h-5 text-white/60" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehiculo(vehiculo._id)}
                          className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors duration-300"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Tipo</div>
                        <div className="text-white font-bold capitalize">{vehiculo.tipo}</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Año</div>
                        <div className="text-white font-bold">{vehiculo.año}</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate('/agregar-cita')}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
                      >
                        Agendar Servicio
                      </button>
                      <button
                        onClick={() => navigate(`/historial-carro/${vehiculo._id}`)}
                        className="flex items-center gap-2 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="inline-block p-8 bg-white/5 rounded-full mb-6">
                  <Car className="w-16 h-16 text-white/30" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">
                  NO HAY VEHÍCULOS REGISTRADOS
                </h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Comienza agregando tu primer vehículo para acceder a nuestros servicios
                </p>
                <button 
                  onClick={() => navigate('/agregarCarro')}
                  className="bg-white text-black font-black py-4 px-8 rounded-xl text-lg uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105"
                >
                  AGREGAR VEHÍCULO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisCarros;