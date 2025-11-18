import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Car, User, Phone, MapPin, Plus, Filter, Search, LogOut } from 'lucide-react';
import { useCitas } from '../../context/CitasContext';
import { useAuth } from '../../context/AuthContext';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { CitaAdminCard } from '../components/CitaAdminCard';
import { estadosConfig } from '../../constants/estados';
import { DiasInhabilesModal } from '../../components/modals/DiasInhabilesModal';

const CitasDashboard = () => {
  const navigate = useNavigate();
  const { getAllCitas, updateCitaEstado } = useCitas();
  const { cliente, logout } = useAuth();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [error, setError] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDiasInhabilesModal, setShowDiasInhabilesModal] = useState(false);

  // Cargar citas
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        setLoading(true);
        const citasData = await getAllCitas();
        setCitas(Array.isArray(citasData) ? citasData : []);
      } catch (error) {
        console.error('Error al cargar citas:', error);
        setError('Error al cargar las citas');
        setCitas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serviciosUnicos = [...new Set(citas.map(cita => cita.tipoServicio))];

  const filteredCitas = citas.filter(cita => {
    const clienteNombre = (cita?.cliente?.nombre || '').toLowerCase();
    const carroTexto = `${cita?.carro?.marca || ''} ${cita?.carro?.modelo || ''}`.toLowerCase();
    const telefono = (cita?.cliente?.telefono || '');
    const matchesSearch =
      clienteNombre.includes(searchTerm.toLowerCase()) ||
      carroTexto.includes(searchTerm.toLowerCase()) ||
      telefono.includes(searchTerm);
    const matchesService = selectedService ? cita.tipoServicio === selectedService : true;
    const matchesMarca = selectedMarca ? cita.carro?.marca === selectedMarca : true;
    const matchesModelo = selectedModelo ? cita.carro?.modelo === selectedModelo : true;
    const matchesDate = selectedDate ? new Date(cita.fechaInicio) >= new Date(selectedDate) : true;

    return matchesSearch && matchesService && matchesMarca && matchesModelo && matchesDate;
  });

  const handleNuevaCita = () => {
    navigate('/agregarCita');
  };

  const handleUpdateEstado = async (citaId, nuevoEstado) => {
    try {
      await updateCitaEstado(citaId, nuevoEstado);
      // Actualizar la lista de citas
      const citasActualizadas = await getAllCitas();
      setCitas(Array.isArray(citasActualizadas) ? citasActualizadas : []);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const handleAdvanceEstado = async (cita) => {
    if (!cita || !cita._id) return;
    const current = (cita.estado || '').toString().toLowerCase();

    const advanceMap = {
      programada: 'en_proceso',
      en_proceso: 'completada'
    };

    const nuevoEstado = advanceMap[current];
    if (!nuevoEstado) return; // no advance available

    try {
      setLoading(true);

      // Optimistic UI update
      setCitas(prev => prev.map(c => c._id === cita._id ? {
        ...c,
        estado: nuevoEstado,
        fechaFin: nuevoEstado === 'completada' ? new Date().toISOString() : c.fechaFin
      } : c));

      // Call backend
      await updateCitaEstado(cita._id, nuevoEstado);

      // Refresh from backend to ensure consistency (like existing logic)
      const fresh = await getAllCitas();
      setCitas(Array.isArray(fresh) ? fresh : []);
    } catch (err) {
      console.error('Error avanzando estado de cita:', err);
      // revert by reloading from backend
      const originales = await getAllCitas();
      setCitas(Array.isArray(originales) ? originales : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
        const nuevoEstado = destination.droppableId;
        try {
            setLoading(true);

            // Actualizar optimísticamente la UI
            const citasActualizadas = citas.map(cita => 
                cita._id === draggableId ? { ...cita, estado: nuevoEstado, fechaFin: nuevoEstado === 'completada' ? new Date().toISOString() : cita.fechaFin } : cita
            );
            setCitas(citasActualizadas);

            const resultado = await updateCitaEstado(draggableId, nuevoEstado);
            // refrescar del backend para asegurar fechaFin correcta
            const fresh = await getAllCitas();
            setCitas(Array.isArray(fresh) ? fresh : []);
            
        } catch (error) {
            console.error('Error en handleDragEnd:', error);
            // Revertir cambios en caso de error
            const citasOriginales = await getAllCitas();
            setCitas(Array.isArray(citasOriginales) ? citasOriginales : []);
        } finally {
            setLoading(false);
        }
    }
  };

  const handleSaveDiasInhabiles = (diasInhabiles) => {
    console.log('Días inhábiles guardados:', diasInhabiles);
    // Aquí puedes implementar la lógica para guardar en tu backend
  };

  const handleLogout = async () => {
    try {
      await logout?.();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  const handleGoProfile = () => {
    navigate('/perfilAdmin');
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

  // Helper: comprobar si una fecha está dentro de las últimas 24 horas
  const withinLast24Hours = (fecha) => {
    if (!fecha) return false;
    const ms = new Date(fecha).getTime();
    if (isNaN(ms)) return false;
    return (Date.now() - ms) <= 24 * 60 * 60 * 1000;
  };

  // Ingresos: sumar solo las citas completadas (todas las completadas, no filtradas por 24h)
  const ingresosCompletadas = filteredCitas
    .filter(c => (c.estado === 'completada'))
    .reduce((sum, c) => sum + (Number(c.costo) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="relative z-10 p-6 flex justify-center">
          <div className="w-full max-w-7xl">
            {/* Header del Dashboard */} 
            <header className="mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-6">
                  <div>
                    <h1 className="text-5xl font-black text-white mb-0 tracking-tight">
                      Revolution Carwash
                    </h1>
                  
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGoProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition"
                    title="Perfil"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-semibold hidden sm:inline">Perfil</span>
                  </button>

                  <button
                    onClick={() => setShowDiasInhabilesModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition"
                    title="Días inhábiles"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold hidden sm:inline">Días inhábiles</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg text-white font-bold transition"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Cerrar sesión</span>
                  </button>
                </div>
              </div>

              {/* Search, filtros y stats (mantengo tu estructura original aquí) */}
              <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/20 max-w-7xl mx-auto">
                <div className="flex flex-col gap-6">
                  {/* Search row */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Search className="text-white/60 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Buscar por cliente, vehículo o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300 hover:bg-white/15 text-center"
                      />
                    </div>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-wider">
                        {showFilters ? 'OCULTAR FILTROS' : 'MOSTRAR FILTROS'}
                      </span>
                    </button>
                  </div>

                  {/* Header action controls already moved above; el resto de filtros y stats siguen igual */}
                  {showFilters && (
                    <div className="pt-4 border-t border-white/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Marca Filter */}
                        <div>
                          <label className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                            Marca
                          </label>
                          <select
                            value={selectedMarca}
                            onChange={(e) => setSelectedMarca(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300"
                          >
                            <option value="">Todas las marcas</option>
                            {[...new Set(citas.map(cita => cita.carro?.marca))].map(marca => (
                              <option key={marca} value={marca}>{marca}</option>
                            ))}
                          </select>
                        </div>

                        {/* Modelo Filter */}
                        <div>
                          <label className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                            Modelo
                          </label>
                          <select
                            value={selectedModelo}
                            onChange={(e) => setSelectedModelo(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300"
                          >
                            <option value="">Todos los modelos</option>
                            {[...new Set(citas.map(cita => cita.carro?.modelo))].map(modelo => (
                              <option key={modelo} value={modelo}>{modelo}</option>
                            ))}
                          </select>
                        </div>

                        {/* Fecha Filter */}
                        <div>
                          <label className="block text-sm font-bold text-white/90 mb-2 uppercase tracking-wider">
                            Fecha Inicio
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 backdrop-blur border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 transition-all duration-300"
                          />
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              setSelectedMarca('');
                              setSelectedModelo('');
                              setSelectedDate('');
                              setSearchTerm('');
                            }}
                            className="w-full px-4 py-2 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all duration-300 text-sm uppercase tracking-wider"
                          >
                            LIMPIAR FILTROS
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center py-4 border-t border-white/10">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-black text-white mb-1">
                        {filteredCitas.length}
                      </div>
                      <div className="text-white/70 font-medium uppercase tracking-wider text-sm text-center">
                        Total Citas
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-black text-white mb-1">
                        ${ingresosCompletadas.toLocaleString()}
                      </div>
                      <div className="text-white/70 font-medium uppercase tracking-wider text-sm text-center">
                        Ingresos (Completadas)
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-black text-white mb-1">
                        {filteredCitas.filter(c => c.estado === 'en_proceso').length}
                      </div>
                      <div className="text-white/70 font-medium uppercase tracking-wider text-sm text-center">
                        En Proceso
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-black text-white mb-1">
                        {filteredCitas.filter(c => c.estado === 'completada' && withinLast24Hours(c.fechaFin)).length}
                      </div>
                      <div className="text-white/70 font-medium uppercase tracking-wider text-sm text-center">
                        Completadas (24h)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Tablero Kanban de Citas */} 
            <main className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {Object.entries(estadosConfig).map(([estado, config]) => {
                  // Filtrar citas por estado; para 'completada' excluir las que tengan fechaFin >24h
                  let citasDeEsteEstado = filteredCitas.filter(cita => cita.estado === estado);
                  if (estado === 'completada') {
                    citasDeEsteEstado = citasDeEsteEstado.filter(cita => withinLast24Hours(cita.fechaFin));
                  }
                  
                  return (
                    <div key={estado} className="space-y-4">
                      {/* Header de columna */} 
                      <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-center">
                        <div className="flex items-center justify-center gap-3">
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
                        type="CITA"
                      >
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-4 min-h-[400px] p-2 rounded-lg transition-colors duration-200 flex flex-col ${
                              snapshot.isDraggingOver ? 'bg-white/5' : ''
                            }`}
                          >
                            {citasDeEsteEstado.map((cita, index) => (
                              <CitaAdminCard 
                                key={cita._id} 
                                cita={cita} 
                                index={index}
                                estadoConfig={estadosConfig[cita.estado]}
                                onAdvance={handleAdvanceEstado}
                              />
                            ))}
                            {provided.placeholder}
                            
                            {citasDeEsteEstado.length === 0 && (
                              <div className="flex items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-2xl">
                                <p className="text-white/50 font-medium uppercase tracking-wider text-center">
                                  SIN CITAS {config.titulo.toUpperCase()}
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

            {/* Modal de Días Inhábiles (se abre desde controles del header) */} 
            <DiasInhabilesModal 
              isOpen={showDiasInhabilesModal}
              onClose={() => setShowDiasInhabilesModal(false)}
              onSave={handleSaveDiasInhabiles}
            />
          </div>
        </div>
      </DragDropContext>
     </div>
  );
};

export default CitasDashboard;