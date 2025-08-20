import { useState } from 'react';
import { Calendar, Clock, Car, User, Phone, MapPin, Plus, Filter, Search } from 'lucide-react';

const CitasDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  // Datos simulados de citas
  const citasSimuladas = [
    {
      id: 1,
      cliente: "Juan Carlos Pérez",
      telefono: "+52 618 123 4567",
      servicio: "Lavado Premium",
      vehiculo: "BMW X5 2023",
      fecha: "2025-08-10",
      hora: "09:00",
      estado: "programada",
      precio: 850,
      ubicacion: "Durango Centro",
      observaciones: "Cliente VIP - Solicita encerado especial"
    },
    {
      id: 2,
      cliente: "María González",
      telefono: "+52 618 987 6543",
      servicio: "Detallado Completo",
      vehiculo: "Mercedes Benz C300",
      fecha: "2025-08-10",
      hora: "10:30",
      estado: "en_proceso",
      precio: 1200,
      ubicacion: "Las Rosas",
      observaciones: "Incluye limpieza de tapicería"
    },
    {
      id: 3,
      cliente: "Roberto Silva",
      telefono: "+52 618 555 1234",
      servicio: "Lavado Express",
      vehiculo: "Toyota Camry 2022",
      fecha: "2025-08-10",
      hora: "11:00",
      estado: "completada",
      precio: 450,
      ubicacion: "Fracc. Real del Mezquital",
      observaciones: ""
    },
    {
      id: 4,
      cliente: "Ana Rodríguez",
      telefono: "+52 618 777 8888",
      servicio: "Lavado Premium",
      vehiculo: "Audi Q7",
      fecha: "2025-08-10",
      hora: "12:00",
      estado: "programada",
      precio: 850,
      ubicacion: "Col. Benito Juárez",
      observaciones: "Primera vez - Cliente potencial VIP"
    },
    {
      id: 5,
      cliente: "Carlos Mendoza",
      telefono: "+52 618 333 2222",
      servicio: "Encerado Profesional",
      vehiculo: "Porsche 911",
      fecha: "2025-08-10",
      hora: "14:00",
      estado: "en_proceso",
      precio: 1500,
      ubicacion: "Zona Dorada",
      observaciones: "Vehículo de lujo - Máximo cuidado"
    }
  ];

  const estadosConfig = {
    programada: {
      titulo: 'PROGRAMADAS',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    en_proceso: {
      titulo: 'EN PROCESO',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-700 dark:text-yellow-300'
    },
    completada: {
      titulo: 'COMPLETADAS',
      color: 'from-green-600 to-green-800',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-700 dark:text-green-300'
    }
  };

  const serviciosUnicos = [...new Set(citasSimuladas.map(cita => cita.servicio))];

  const filteredCitas = citasSimuladas.filter(cita => {
    const matchesSearch = cita.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.telefono.includes(searchTerm);
    const matchesService = selectedService ? cita.servicio === selectedService : true;
    return matchesSearch && matchesService;
  });

  const CitaCard = ({ cita }) => {
    const estadoConfig = estadosConfig[cita.estado];
    
    return (
      <div className="group relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 hover:shadow-white/10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
        {/* Header de la tarjeta */}
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${estadoConfig.color} text-white`}>
            {cita.hora}
          </div>
          <div className="text-white font-black text-lg">
            ${cita.precio.toLocaleString()}
          </div>
        </div>

        {/* Cliente */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <User className="text-white/60 text-sm w-4 h-4" />
            <h3 className="text-white font-bold text-lg tracking-wide">
              {cita.cliente}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Phone className="text-xs w-3 h-3" />
            <span className="text-sm font-medium">{cita.telefono}</span>
          </div>
        </div>

        {/* Vehículo */}
        <div className="mb-3 flex items-center gap-2">
          <Car className="text-white/60 w-4 h-4" />
          <span className="text-white font-semibold">{cita.vehiculo}</span>
        </div>

        {/* Servicio */}
        <div className="mb-3">
          <div className="inline-block px-3 py-1 bg-white/10 rounded-lg border border-white/20">
            <span className="text-white/90 text-sm font-bold uppercase tracking-wide">
              {cita.servicio}
            </span>
          </div>
        </div>

        {/* Ubicación */}
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="text-white/60 text-sm w-4 h-4" />
          <span className="text-white/70 text-sm">{cita.ubicacion}</span>
        </div>

        {/* Observaciones */}
        {cita.observaciones && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/80 text-xs leading-relaxed">
              {cita.observaciones}
            </p>
          </div>
        )}

        {/* Elemento decorativo inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
      </div>

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
                
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105">
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
                  <div className="space-y-4 min-h-[400px]">
                    {citasDeEsteEstado.map(cita => (
                      <CitaCard key={cita.id} cita={cita} />
                    ))}
                    
                    {citasDeEsteEstado.length === 0 && (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-2xl">
                        <p className="text-white/50 font-medium uppercase tracking-wider">
                          Sin citas {config.titulo.toLowerCase()}
                        </p>
                      </div>
                    )}
                  </div>
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
                ${filteredCitas.reduce((sum, cita) => sum + cita.precio, 0).toLocaleString()}
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
    </div>
  );
};

export default CitasDashboard;