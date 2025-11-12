import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCitas } from '../../context/CitasContext';
import { useCarro } from '../../context/CarroContext';
import Sidebar from '../components/sidebar';
import { Calendar, Plus, Search, Settings2, Trash2, Clock, Car } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MisCitas = () => {
  const navigate = useNavigate();
  const { cliente } = useAuth();
  const { deleteCita } = useCitas();
  const { isDarkMode } = useTheme();
  const { getCarroById } = useCarro();
  const [citas, setCitas] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      if (cliente?.citas && Array.isArray(cliente.citas)) {
        try {
          setLoading(true);

          // Fetch car details for each cita
          const citasPromises = cliente.citas.map(async (cita) => {
            try {
              let carroData = null;
              if (cita.carro) {
                const res = await getCarroById(cita.carro);
                carroData = res?.data ?? res;
              }

              return {
                ...cita,
                carro: carroData || {
                  marca: 'No disponible',
                  modelo: 'No disponible',
                  placas: 'No disponible',
                  color: 'No disponible',
                  año: 'N/A',
                  tipo: 'No disponible'
                }
              };
            } catch (error) {
              console.error(`Error fetching car details for ID ${cita.carro}:`, error);
              return {
                ...cita,
                carro: {
                  marca: 'No disponible',
                  modelo: '',
                  placas: ''
                }
              };
            }
          });

          const citasFormateadas = await Promise.all(citasPromises);
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
  }, [cliente, getCarroById]);

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
        (cita.tipoServicio || '').toLowerCase().includes(searchTerm) ||
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
    <div className={`flex min-h-screen ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
        : 'bg-gradient-to-br from-white to-gray-100'
    }`}>
      <Sidebar onHover={(isOpen) => setIsSidebarOpen(isOpen)} />

      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'
      }`}>
        <div className="p-6 md:p-8">
          {/* Header */}
          <header className="max-w-7xl mx-auto mb-12">
            <div className={`${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white/80 border-gray-200 text-gray-900'} backdrop-blur-xl rounded-2xl border p-8`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h1 className={`text-4xl font-black mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Mis Citas
                  </h1>
                  <p className={`${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    Gestiona y visualiza todas tus citas programadas
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/agregar-cita')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/20'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:shadow-lg'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Programar Nueva Cita</span>
                </button>
              </div>

              {/* Search and Filter Bar */}
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Buscar por servicio o fecha..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none ${
                      isDarkMode
                        ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/20'
                        : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300'
                    }`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFiltroActivo('todos')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'todos'
                        ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 text-gray-900 border-gray-200')
                        : (isDarkMode ? 'border-white/10 text-white/60 hover:border-white/20' : 'border-gray-200 text-gray-600 hover:border-gray-300')
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFiltroActivo('programadas')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'programadas'
                        ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 text-gray-900 border-gray-200')
                        : (isDarkMode ? 'border-white/10 text-white/60 hover:border-white/20' : 'border-gray-200 text-gray-600 hover:border-gray-300')
                    }`}
                  >
                    Programadas
                  </button>
                  <button
                    onClick={() => setFiltroActivo('completadas')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'completadas'
                        ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 text-gray-900 border-gray-200')
                        : (isDarkMode ? 'border-white/10 text-white/60 hover:border-white/20' : 'border-gray-200 text-gray-600 hover:border-gray-300')
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
                  <div key={skeleton} className={`${isDarkMode ? 'animate-pulse bg-black/40 border border-white/10' : 'animate-pulse bg-white border border-gray-200'} backdrop-blur-xl rounded-2xl p-8`}>
                    <div className={`${isDarkMode ? 'h-8 bg-white/5' : 'h-8 bg-gray-100'} rounded-lg w-3/4 mb-4`}></div>
                    <div className={`${isDarkMode ? 'h-6 bg-white/5' : 'h-6 bg-gray-100'} rounded-lg w-1/2 mb-8`}></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${isDarkMode ? 'h-10 bg-white/5' : 'h-10 bg-gray-100'} rounded-lg`}></div>
                      <div className={`${isDarkMode ? 'h-10 bg-white/5' : 'h-10 bg-gray-100'} rounded-lg`}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : citas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {citasFiltradas.map((cita) => (
                  <div key={cita._id} className={`group backdrop-blur-xl rounded-2xl p-8 transition-all duration-500 ${
                    isDarkMode ? 'bg-black/40 border border-white/10 hover:border-white/20' : 'bg-white shadow-sm border border-gray-200 hover:shadow-md'
                  }`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {cita.tipoServicio}
                        </h3>
                        <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                          {new Date(cita.fechaInicio).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/editar-cita/${cita._id}`)}
                          className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <Settings2 className={`w-5 h-5 ${isDarkMode ? 'text-white/60' : 'text-gray-700'}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteCita(cita._id)}
                          className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-red-100 hover:bg-red-200'}`}
                        >
                          <Trash2 className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Car Information Section */}
                    <div className={`${isDarkMode ? 'mb-6 p-4 bg-white/5 border border-white/10 rounded-xl' : 'mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Car className={`w-5 h-5 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`} />
                        <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {cita.carro?.marca && cita.carro?.modelo 
                            ? `${cita.carro.marca} ${cita.carro.modelo}`
                            : 'Vehículo no especificado'}
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className={`${isDarkMode ? 'text-white/50' : 'text-gray-500'} text-sm`}>Placas</span>
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                            {cita.carro?.placas || 'No disponible'}
                          </p>
                        </div>
                        <div>
                          <span className={`${isDarkMode ? 'text-white/50' : 'text-gray-500'} text-sm`}>Color</span>
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                            {cita.carro?.color || 'No disponible'}
                          </p>
                        </div>
                        <div>
                          <span className={`${isDarkMode ? 'text-white/50' : 'text-gray-500'} text-sm`}>Año</span>
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                            {cita.carro?.año || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className={`${isDarkMode ? 'text-white/50' : 'text-gray-500'} text-sm`}>Tipo</span>
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                            {cita.carro?.tipo || 'No disponible'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className={`${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-gray-50 text-gray-600'} rounded-xl p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <div className="text-sm mb-1">Hora</div>
                        <div className={`${isDarkMode ? 'text-white font-bold' : 'text-gray-900 font-bold'}`}>
                          {new Date(cita.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className={`${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-gray-50 text-gray-600'} rounded-xl p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <div className="text-sm mb-1">Estado</div>
                        <div className={`${isDarkMode ? 'text-white font-bold' : 'text-gray-900 font-bold'} capitalize`}>
                          {cita.estado}
                        </div>
                      </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-gray-50 text-gray-600'} rounded-xl p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} mb-6`}>
                      <div className="text-sm mb-1">Costo</div>
                      <div className={`${isDarkMode ? 'text-white font-bold' : 'text-gray-900 font-bold'}`}>
                        ${cita.costo}
                      </div>
                    </div>

                    {cita.informacionAdicional && (
                      <div className={`${isDarkMode ? 'mt-4 p-4 bg-white/5 text-white/60' : 'mt-4 p-4 bg-gray-50 text-gray-700'} rounded-xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <div className="text-sm mb-1">Información Adicional</div>
                        <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cita.informacionAdicional}</div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/detalles-cita/${cita._id}`)}
                        className={`flex-1 py-3 rounded-xl transition-all duration-300 border ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white border-white/10 hover:border-white/20' : 'bg-white text-gray-900 border-gray-200 hover:shadow-sm'}`}
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => navigate(`/historial-cita/${cita._id}`)}
                        className={`flex items-center gap-2 px-4 rounded-xl transition-all duration-300 border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'}`}
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${isDarkMode ? 'text-center py-20 bg-black/40 text-white' : 'text-center py-20 bg-white/80 text-gray-900'} backdrop-blur-xl rounded-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className={`${isDarkMode ? 'inline-block p-8 bg-white/5 rounded-full mb-6' : 'inline-block p-8 bg-gray-100 rounded-full mb-6'}`}>
                  <Calendar className={`w-16 h-16 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-xl font-black mb-2">
                  NO HAY CITAS PROGRAMADAS
                </h3>
                <p className={`${isDarkMode ? 'text-white/70' : 'text-gray-600'} mb-6 max-w-md mx-auto`}>
                  Programa tu primera cita para comenzar a disfrutar de nuestros servicios
                </p>
                <button 
                  onClick={() => navigate('/agregar-cita')}
                  className={`${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} font-black py-4 px-8 rounded-xl text-lg uppercase tracking-wider transition-all duration-300 hover:opacity-90`}
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
