import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarro } from '../../context/CarroContext';
import { useCitas } from '../../context/CitasContext';
import Sidebar from '../components/sidebar';
import EditVehiculoModal from '../components/modals/EditVehiculoModal';
import { Car, Plus, Search, Settings2, Info, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MisCarros = () => {
  const navigate = useNavigate();
  const { cliente } = useAuth();
  const { getCarroById, deleteCarros, updateCarros } = useCarro();
  const citasCtx = useCitas();
  const { isDarkMode } = useTheme();

  const [vehiculos, setVehiculos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  // modal / notification state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', text }

  useEffect(() => {
    const fetchVehiculos = async () => {
      if (cliente?.carros) {
        try {
          setLoading(true);
          const carroIds = cliente.carros.map(carro =>
            typeof carro === 'string' ? carro : carro._id
          );

          const vehiculosPromises = carroIds.map(id => getCarroById(id));
          const vehiculosData = await Promise.all(vehiculosPromises);
          setVehiculos(vehiculosData.filter(v => v !== null));
        } catch (error) {
          console.error('Error al obtener vehículos:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, [cliente, getCarroById]);

  // helper: comprueba si un vehículo tiene citas activas (programada | en_proceso)
  const checkActiveCitas = async (vehiculo) => {
    try {
      if (Array.isArray(vehiculo?.citas) && vehiculo.citas.length > 0) {
        return vehiculo.citas.some(c => ['programada', 'en_proceso'].includes((c?.estado || '').toString().toLowerCase()));
      }

      const fnCandidates = [
        citasCtx?.getCitasByCarro,
        citasCtx?.getCitasPorCarro,
        citasCtx?.getCitasByCarroRequest,
        citasCtx?.getByCarro
      ].filter(Boolean);

      if (fnCandidates.length > 0) {
        const fn = fnCandidates[0];
        const res = await fn(vehiculo._id);
        const arr = Array.isArray(res) ? res : (res?.data ?? []);
        return (arr || []).some(c => ['programada', 'en_proceso'].includes((c?.estado || '').toString().toLowerCase()));
      }

      return false;
    } catch (err) {
      console.warn('Error verificando citas activas:', err);
      return true;
    }
  };

  const openEditModal = async (vehiculo) => {
    const hasActive = await checkActiveCitas(vehiculo);
    if (hasActive) {
      setNotification({ type: 'error', text: 'No puedes modificar este vehículo porque tiene citas activas.' });
      setTimeout(() => setNotification(null), 3500);
      return;
    }
    setEditingVehiculo(vehiculo);
    setIsEditOpen(true);
  };

  const handleDeleteVehiculo = async (id) => {
    const veh = vehiculos.find(v => v._id === id);
    if (!veh) return;
    const hasActive = await checkActiveCitas(veh);
    if (hasActive) {
      setNotification({ type: 'error', text: 'No puedes eliminar este vehículo porque tiene citas activas.' });
      setTimeout(() => setNotification(null), 3500);
      return;
    }

    try {
      await deleteCarros(id);
      setVehiculos(prev => prev.filter(vehiculo => vehiculo._id !== id));
      setNotification({ type: 'success', text: 'Vehículo eliminado correctamente.' });
      setTimeout(() => setNotification(null), 2500);
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      setNotification({ type: 'error', text: 'Error al eliminar vehículo.' });
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleSaveEdit = async (updatedForm) => {
    if (!editingVehiculo) return;
    try {
      if (typeof updateCarros === 'function') {
        await updateCarros(editingVehiculo._id, updatedForm);
      } else {
        console.warn('updateCarros no disponible en contexto; aplicando cambio localmente.');
      }

      setVehiculos(prev => prev.map(v => (v._id === editingVehiculo._id ? { ...v, ...updatedForm } : v)));
      setNotification({ type: 'success', text: 'Vehículo actualizado correctamente.' });
      setIsEditOpen(false);
      setEditingVehiculo(null);
      setTimeout(() => setNotification(null), 2500);
    } catch (err) {
      console.error('Error guardando vehículo:', err);
      setNotification({ type: 'error', text: err?.message || 'Error al actualizar vehículo.' });
      setTimeout(() => setNotification(null), 3500);
    }
  };

  // Filtrado por categoría (carros / camionetas / motocicletas)
  const matchesCategory = (v) => {
    if (!v) return false;
    const t = (v.tipo || '').toString().toLowerCase();
    switch (filtroActivo) {
      case 'carros':
        return t.includes('carro');
      case 'camionetas':
        return t.includes('camioneta');
      case 'motocicletas':
        return t.includes('moto') || t.includes('motocicleta');
      default:
        return true;
    }
  };

  // Buscador: marca, modelo, placas, tipo
  const matchesSearch = (v) => {
    const q = (busqueda || '').trim().toLowerCase();
    if (!q) return true;
    const fields = [
      v.marca,
      v.modelo,
      v.placas,
      v.tipo,
      v._id
    ].filter(Boolean).map(f => f.toString().toLowerCase());
    return fields.some(f => f.includes(q));
  };

  const filteredVehiculos = vehiculos.filter(v => matchesCategory(v) && matchesSearch(v));

  // Theme-aware classes
  const containerBg = isDarkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-gray-50';
  const headerCard = isDarkMode
    ? 'bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8'
    : 'bg-white rounded-2xl border border-gray-200 p-8 shadow-sm';
  const inputClass = isDarkMode
    ? 'w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20'
    : 'w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300';
  const cardBase = isDarkMode
    ? 'group bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-500'
    : 'group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300';
  const smallBox = isDarkMode ? 'bg-white/5 rounded-xl p-4 border border-white/10' : 'bg-gray-50 rounded-xl p-4 border border-gray-100';
  const notifSuccess = isDarkMode ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  const notifError = isDarkMode ? 'bg-rose-900/40 text-rose-200 border border-rose-800' : 'bg-rose-50 text-rose-700 border border-rose-200';
  const emptyStateClass = isDarkMode ? 'text-white/70 bg-black/40' : 'text-gray-700 bg-white';

  return (
    <div className={`flex min-h-screen ${containerBg}`}>
      <Sidebar onHover={(isOpen) => setIsSidebarOpen(isOpen)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'}`}>
        <div className="p-6 md:p-8">
          {/* Header */}
          <header className="max-w-7xl mx-auto mb-12">
            <div className={headerCard}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h1 className={`text-4xl font-black mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Mis Vehículos
                  </h1>
                  <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>
                    Gestiona y visualiza todos tus vehículos registrados
                  </p>
                </div>
                <button
                  onClick={() => navigate('/agregarCarro')}
                  className={`${isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-black' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'} flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Agregar Nuevo Vehículo</span>
                </button>
              </div>

              {/* Search and Filter Bar */}
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-white/40' : 'text-gray-400'} w-5 h-5`} />
                  <input
                    type="text"
                    placeholder="Buscar por marca, modelo, placas o tipo..."
                    className={inputClass}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFiltroActivo('todos')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'todos'
                        ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 text-gray-900 border-gray-200')
                        : (isDarkMode ? 'border-white/10 text-white/60 hover:border-white/20' : 'border-gray-100 text-gray-600 hover:border-gray-300')
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFiltroActivo('carros')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'carros'
                        ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 text-gray-900 border-gray-200')
                        : (isDarkMode ? 'border-white/10 text-white/60 hover:border-white/20' : 'border-gray-100 text-gray-600 hover:border-gray-300')
                    }`}
                  >
                    Carros
                  </button>
                  <button
                    onClick={() => setFiltroActivo('camionetas')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'camionetas'
                        ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 text-gray-900 border-gray-200')
                        : (isDarkMode ? 'border-white/10 text-white/60 hover:border-white/20' : 'border-gray-100 text-gray-600 hover:border-gray-300')
                    }`}
                  >
                    Camionetas
                  </button>
                  <button
                    onClick={() => setFiltroActivo('motocicletas')}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      filtroActivo === 'motocicletas'
                        ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 text-gray-900 border-gray-200')
                        : (isDarkMode ? 'border-white/10 text-white/60 hover:border-white/20' : 'border-gray-100 text-gray-600 hover:border-gray-300')
                    }`}
                  >
                    Motocicletas
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Notification */}
          {notification && (
            <div className={`max-w-7xl mx-auto mb-6 p-4 rounded-lg ${notification.type === 'error' ? notifError : notifSuccess}`}>
              {notification.text}
            </div>
          )}

          {/* Vehículos Grid */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((skeleton) => (
                  <div key={skeleton} className={`${cardBase} animate-pulse`}>
                    <div className="h-8 bg-white/5 rounded-lg w-3/4 mb-4"></div>
                    <div className="h-6 bg-white/5 rounded-lg w-1/2 mb-8"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-10 bg-white/5 rounded-lg"></div>
                      <div className="h-10 bg-white/5 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : vehiculos.length === 0 ? (
              <div className={`text-center py-20 ${emptyStateClass} rounded-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="inline-block p-8 bg-white/5 rounded-full mb-6">
                  <Car className="w-16 h-16 text-white/30" />
                </div>
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xl font-black mb-2`}>
                  NO HAY VEHÍCULOS REGISTRADOS
                </h3>
                <p className={`${isDarkMode ? 'text-white/70' : 'text-gray-600'} mb-6 max-w-md mx-auto`}>
                  Comienza agregando tu primer vehículo para acceder a nuestros servicios
                </p>
                <button
                  onClick={() => navigate('/agregarCarro')}
                  className={`${isDarkMode ? 'bg-white text-black' : 'bg-white text-black'} font-black py-4 px-8 rounded-xl text-lg uppercase tracking-wider transition-all duration-300 hover:bg-gray-200`}
                >
                  AGREGAR VEHÍCULO
                </button>
              </div>
            ) : filteredVehiculos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredVehiculos.map((vehiculo) => (
                  <div key={vehiculo._id} className={cardBase}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-2`}>
                          {vehiculo.marca} {vehiculo.modelo}
                        </h3>
                        <p className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>{vehiculo.placas}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(vehiculo)}
                          className={`${isDarkMode ? 'p-2 bg-white/5 rounded-lg hover:bg-white/10' : 'p-2 bg-gray-50 rounded-lg hover:bg-gray-100'} transition-colors duration-300`}
                          title="Editar vehículo"
                        >
                          <Settings2 className="w-5 h-5 text-white/60" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehiculo(vehiculo._id)}
                          className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors duration-300"
                          title="Eliminar vehículo"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className={smallBox}>
                        <div className={`${isDarkMode ? 'text-white/60' : 'text-gray-600'} text-sm mb-1`}>Tipo</div>
                        <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-white font-bold capitalize`}>{vehiculo.tipo}</div>
                      </div>
                      <div className={smallBox}>
                        <div className={`${isDarkMode ? 'text-white/60' : 'text-gray-600'} text-sm mb-1`}>Año</div>
                        <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold`}>{vehiculo.año}</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate('/agregarCita')}
                        className={`${isDarkMode ? 'flex-1 bg-white/10 hover:bg-white/20 text-white' : 'flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900'} py-3 rounded-xl transition-all duration-300 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}
                      >
                        Agendar Servicio
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">No se encontraron vehículos</h3>
                <p className="text-white/70 mb-4">Prueba otro término de búsqueda o selecciona "Todos".</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => { setFiltroActivo('todos'); setBusqueda(''); }} className="px-4 py-2 rounded-lg bg-white/10 text-white">Restablecer filtros</button>
                  <button onClick={() => navigate('/agregarCarro')} className="px-4 py-2 rounded-lg bg-white text-black">Agregar vehículo</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <EditVehiculoModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingVehiculo(null); }}
        vehiculo={editingVehiculo}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default MisCarros;