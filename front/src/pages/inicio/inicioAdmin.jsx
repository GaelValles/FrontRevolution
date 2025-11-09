import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Car, User, Phone, MapPin, Plus, Filter, Search } from 'lucide-react';
import { useCitas } from '../../context/CitasContext';
import { useAuth } from '../../context/AuthContext';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { CitaAdminCard } from '../components/CitaAdminCard';
import { estadosConfig } from '../../constants/estados';

const CitasDashboard = () => {
  const navigate = useNavigate();
  const { getAllCitas, updateCitaEstado } = useCitas();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [error, setError] = useState(null);

  // Cargar citas
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        setLoading(true);
        const citasData = await getAllCitas();
        setCitas(citasData);
      } catch (error) {
        console.error('Error al cargar citas:', error);
        setError('Error al cargar las citas');
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const serviciosUnicos = [...new Set(citas.map(cita => cita.tipoServicio))];

  const filteredCitas = citas.filter(cita => {
    const matchesSearch = 
      cita.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${cita.carro.marca} ${cita.carro.modelo}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.cliente.telefono.includes(searchTerm);
    const matchesService = selectedService ? cita.tipoServicio === selectedService : true;
    return matchesSearch && matchesService;
  });

  const handleNuevaCita = () => {
    navigate('/agregarCita');
  };

  const handleUpdateEstado = async (citaId, nuevoEstado) => {
    try {
      await updateCitaEstado(citaId, nuevoEstado);
      // Actualizar la lista de citas
      const citasActualizadas = await getAllCitas();
      setCitas(citasActualizadas);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  // Update the handleDragEnd function
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
        const nuevoEstado = destination.droppableId;
        try {
            setLoading(true);
            console.log('Iniciando actualización:', { 
                citaId: draggableId, 
                nuevoEstado,
                source: source.droppableId,
                destination: destination.droppableId
            });

            // Actualizar optimísticamente la UI
            const citasActualizadas = citas.map(cita => 
                cita._id === draggableId ? { ...cita, estado: nuevoEstado } : cita
            );
            setCitas(citasActualizadas);

            const resultado = await updateCitaEstado(draggableId, nuevoEstado);
            console.log('Actualización completada:', resultado);
            
        } catch (error) {
            console.error('Error en handleDragEnd:', error);
            // Revertir cambios en caso de error
            const citasOriginales = await getAllCitas();
            setCitas(citasOriginales);
        } finally {
            setLoading(false);
        }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold">Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="relative z-10 p-6">
          {/* Header del Dashboard */}
          <header className="mb-8">
            <div className="text-center mb-6">
              <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                DASHBOARD
                <span className="block text-2xl font-light tracking-widest text-white/80 mt-1">
                  CITAS REVOLUTION
                </span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
            </div>

            {/* Controles de búsqueda y filtros */}
            <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/20 max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Búsqueda */}
                <div className="flex items-center gap-3 flex-1">
                  <Search className="text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, vehículo o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300 hover:bg-white/15"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="font-bold text-sm uppercase tracking-wider">FILTROS</span>
                  </button>
                  
                  <button onClick={handleNuevaCita} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105">
                    <Plus className="w-4 h-4" />
                    NUEVA CITA
                  </button>
                </div>
              </div>

              {/* Panel de filtros */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                        Servicio
                      </label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="px-4 py-2 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300"
                      >
                        <option value="">Todos los servicios</option>
                        {serviciosUnicos.map(servicio => (
                          <option key={servicio} value={servicio}>{servicio}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSelectedService('');
                          setSearchTerm('');
                        }}
                        className="px-4 py-2 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all duration-300 text-sm uppercase tracking-wider"
                      >
                        LIMPIAR
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Tablero Kanban de Citas */}
          <main className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Object.entries(estadosConfig).map(([estado, config]) => {
                const citasDeEsteEstado = filteredCitas.filter(cita => cita.estado === estado);
                
                return (
                  <div key={estado} className="space-y-4">
                    {/* Header de columna */}
                    <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                      <div className="flex items-center justify-between">
                        <h2 className="text-white font-black text-lg uppercase tracking-wider">
                          {config.titulo}
                        </h2>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color}`}></div>
                          <span className="text-white/70 font-bold">
                            {citasDeEsteEstado.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tarjetas de citas */}
                    <Droppable 
                      droppableId={estado}
                      type="CITA" // Add this to ensure cards can move between columns
                    >
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-4 min-h-[400px] p-2 rounded-lg transition-colors duration-200 ${
                            snapshot.isDraggingOver ? 'bg-white/5' : ''
                          }`}
                        >
                          {citasDeEsteEstado.map((cita, index) => (
                            <CitaAdminCard 
                              key={cita._id} 
                              cita={cita} 
                              index={index}
                              estadoConfig={estadosConfig[cita.estado]}
                            />
                          ))}
                          {provided.placeholder}
                          
                          {citasDeEsteEstado.length === 0 && (
                            <div className="flex items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-2xl">
                              <p className="text-white/50 font-medium uppercase tracking-wider">
                                Sin citas {config.titulo.toLowerCase()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </main>

          {/* Footer con estadísticas */}
          <footer className="mt-12 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-black text-white mb-1">
                  {filteredCitas.length}
                </div>
                <div className="text-white/70 font-medium uppercase tracking-wider text-sm">
                  Total Citas
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white mb-1">
                  ${filteredCitas.reduce((sum, cita) => sum + (cita.costo || 0), 0).toLocaleString()}
                </div>
                <div className="text-white/70 font-medium uppercase tracking-wider text-sm">
                  Ingresos del Día
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white mb-1">
                  {filteredCitas.filter(c => c.estado === 'completada').length}
                </div>
                <div className="text-white/70 font-medium uppercase tracking-wider text-sm">
                  Completadas
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white mb-1">
                  {filteredCitas.filter(c => c.estado === 'en_proceso').length}
                </div>
                <div className="text-white/70 font-medium uppercase tracking-wider text-sm">
                  En Proceso
                </div>
              </div>
            </div>
          </footer>
        </div>
      </DragDropContext>
    </div>
  );
};

export default CitasDashboard;