import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCitas } from '../../context/CitasContext';
import Sidebar from '../components/sidebar';
import { Calendar, Plus, Search, Filter, Settings2, Trash2, Clock } from 'lucide-react';

const MisCitas = () => {
  const navigate = useNavigate();
  const { cliente } = useAuth();
  const { deleteCita } = useCitas(); // Changed this line
  const [citas, setCitas] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Cliente en MisCitas:', cliente?.citas);
    const fetchCitas = async () => {
      if (cliente?.citas && Array.isArray(cliente.citas)) {
        try {
          setLoading(true);
          // Las citas ya están en cliente.citas, no necesitamos fetchearlas
          const citasFormateadas = cliente.citas.map(cita => ({
            _id: cita._id,
            tipoServicio: cita.tipoServicio,
            fechaInicio: cita.fechaInicio,
            fechaFin: cita.fechaFin,
            estado: cita.estado,
            costo: cita.costo,
            carro: cita.carro,
            informacionAdicional: cita.informacionAdicional
          }));
          
          console.log('Citas formateadas:', citasFormateadas);
          setCitas(citasFormateadas);
        } catch (error) {
          console.error('Error al procesar citas:', error);
          setCitas([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setCitas([]);
      }
    };

    fetchCitas();
  }, [cliente]);

  // Agregar función para filtrar citas
  const citasFiltradas = citas.filter(cita => {
    // Aplicar filtro de estado
    if (filtroActivo !== 'todos' && cita.estado !== filtroActivo) {
      return false;
    }
    
    // Aplicar búsqueda
    if (busqueda) {
      const searchTerm = busqueda.toLowerCase();
      return (
        cita.tipoServicio.toLowerCase().includes(searchTerm) ||
        new Date(cita.fechaInicio).toLocaleDateString().includes(searchTerm)
      );
    }
    
    return true;
  });

  const handleDeleteCita = async (id) => {
    try {
      await deleteCita(id);
      setCitas(prev => prev.filter(cita => cita._id !== id));
    } catch (error) {
      console.error('Error al eliminar cita:', error);
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
                    Mis Citas
                  </h1>
                  <p className="text-white/70">
                    Gestiona y visualiza todas tus citas programadas
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/agregar-cita')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <Plus className="w-5 h-5" />
                  <span>Programar Nueva Cita</span>
                </button>
              </div>

              {/* Search and Filter Bar */}
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por servicio o fecha..."
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
                    Todas
                  </button>
                  <button
                    onClick={() => setFiltroActivo('programadas')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'programadas'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    Programadas
                  </button>
                  <button
                    onClick={() => setFiltroActivo('completadas')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'completadas'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    Completadas
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Citas Grid */}
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
            ) : citas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {citasFiltradas.map((cita) => (
                  <div key={cita._id} className="group bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-500">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-white mb-2">
                          {cita.tipoServicio}
                        </h3>
                        <p className="text-white/60">
                          {new Date(cita.fechaInicio).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/editar-cita/${cita._id}`)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
                        >
                          <Settings2 className="w-5 h-5 text-white/60" />
                        </button>
                        <button
                          onClick={() => handleDeleteCita(cita._id)}
                          className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors duration-300"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Hora</div>
                        <div className="text-white font-bold">
                          {new Date(cita.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Estado</div>
                        <div className="text-white font-bold capitalize">
                          {cita.estado}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Costo</div>
                        <div className="text-white font-bold">
                          ${cita.costo}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Duración</div>
                        <div className="text-white font-bold">
                          {Math.round((new Date(cita.fechaFin) - new Date(cita.fechaInicio)) / (1000 * 60))} min
                        </div>
                      </div>
                    </div>
                    {cita.informacionAdicional && (
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Información Adicional</div>
                        <div className="text-white">{cita.informacionAdicional}</div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/detalles-cita/${cita._id}`)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => navigate(`/historial-cita/${cita._id}`)}
                        className="flex items-center gap-2 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="inline-block p-8 bg-white/5 rounded-full mb-6">
                  <Calendar className="w-16 h-16 text-white/30" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">
                  NO HAY CITAS PROGRAMADAS
                </h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Programa tu primera cita para comenzar a disfrutar de nuestros servicios
                </p>
                <button 
                  onClick={() => navigate('/agregar-cita')}
                  className="bg-white text-black font-black py-4 px-8 rounded-xl text-lg uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105"
                >
                  PROGRAMAR CITA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisCitas;