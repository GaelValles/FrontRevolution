import { useState } from 'react';
import { Calendar, Clock, Car, User, Phone, MapPin, Plus, CheckCircle, AlertCircle, Settings } from 'lucide-react';

const InicioCliente = () => {
  // Datos simulados del cliente
  const clienteInfo = {
    nombre: "Juan Carlos Pérez",
    telefono: "+52 618 123 4567",
    email: "juan.perez@email.com",
    vehiculos: ["BMW X5 2023", "Mercedes Benz C300 2022"]
  };

  // Citas simuladas del cliente (máximo 2)
  const citasCliente = [
    {
      id: 1,
      servicio: "Lavado Premium",
      vehiculo: "BMW X5 2023",
      fecha: "2025-08-10",
      hora: "14:00",
      estado: "programada",
      precio: 850,
      ubicacion: "Revolution Car Wash - Durango Centro",
      observaciones: "Incluye encerado especial",
      tiempoEstimado: "45 min",
      empleadoAsignado: "Carlos Mendoza"
    },
    {
      id: 2,
      servicio: "Detallado Completo",
      vehiculo: "Mercedes Benz C300 2022",
      fecha: "2025-08-12",
      hora: "10:30",
      estado: "programada",
      precio: 1200,
      ubicacion: "Revolution Car Wash - Las Rosas",
      observaciones: "Limpieza profunda de tapicería",
      tiempoEstimado: "2 horas",
      empleadoAsignado: "Ana Rodríguez"
    }
  ];

  const getEstadoConfig = (estado) => {
    const configs = {
      programada: {
        color: 'from-blue-500 to-blue-700',
        bgColor: 'bg-blue-500/20',
        icon: Clock,
        text: 'PROGRAMADA',
        textColor: 'text-blue-300'
      },
      en_proceso: {
        color: 'from-yellow-500 to-orange-600',
        bgColor: 'bg-yellow-500/20',
        icon: AlertCircle,
        text: 'EN PROCESO',
        textColor: 'text-yellow-300'
      },
      completada: {
        color: 'from-green-500 to-green-700',
        bgColor: 'bg-green-500/20',
        icon: CheckCircle,
        text: 'COMPLETADA',
        textColor: 'text-green-300'
      }
    };
    return configs[estado] || configs.programada;
  };

  const CitaClienteCard = ({ cita, index }) => {
    const estadoConfig = getEstadoConfig(cita.estado);
    const IconoEstado = estadoConfig.icon;
    
    return (
      <div className="group relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-white/40 hover:shadow-white/10 hover:shadow-2xl transition-all duration-500 hover:scale-105 min-h-[400px]">
        {/* Header premium */}
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${estadoConfig.color} text-white`}>
            <IconoEstado className="w-4 h-4" />
            <span className="text-sm font-black uppercase tracking-wider">
              {estadoConfig.text}
            </span>
          </div>
          <div className="text-right">
            <div className="text-white font-black text-2xl">
              ${cita.precio.toLocaleString()}
            </div>
            <div className="text-white/60 text-xs uppercase tracking-wider">
              MXN
            </div>
          </div>
        </div>

        {/* Servicio principal */}
        <div className="mb-6 text-center">
          <h2 className="text-white font-black text-3xl tracking-wide mb-2">
            {cita.servicio}
          </h2>
          <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
        </div>

        {/* Detalles de la cita */}
        <div className="space-y-4 mb-6">
          {/* Vehículo */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <Car className="text-white/60 w-5 h-5" />
            <div>
              <div className="text-white font-bold">{cita.vehiculo}</div>
              <div className="text-white/60 text-xs uppercase">TU VEHÍCULO</div>
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <Calendar className="text-white/60 w-5 h-5" />
              <div>
                <div className="text-white font-bold">
                  {new Date(cita.fecha).toLocaleDateString('es-MX', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-white/60 text-xs uppercase">FECHA</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <Clock className="text-white/60 w-5 h-5" />
              <div>
                <div className="text-white font-bold">{cita.hora}</div>
                <div className="text-white/60 text-xs uppercase">{cita.tiempoEstimado}</div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <MapPin className="text-white/60 w-5 h-5" />
            <div className="flex-1">
              <div className="text-white font-bold text-sm">{cita.ubicacion}</div>
              <div className="text-white/60 text-xs uppercase">UBICACIÓN</div>
            </div>
          </div>

          {/* Empleado asignado */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <User className="text-white/60 w-5 h-5" />
            <div>
              <div className="text-white font-bold">{cita.empleadoAsignado}</div>
              <div className="text-white/60 text-xs uppercase">ESPECIALISTA</div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {cita.observaciones && (
          <div className="mb-6 p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10">
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">NOTAS ESPECIALES</div>
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              {cita.observaciones}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider border border-white/20 hover:border-white/40">
            MODIFICAR
          </button>
          <button className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider">
            CANCELAR
          </button>
        </div>

        {/* Elemento decorativo */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"></div>
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
        {/* Header del cliente */}
        <header className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-full mb-4 backdrop-blur-xl border border-white/20">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-xl text-white/70 font-medium tracking-wide">
              {clienteInfo.nombre}
            </p>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-4"></div>
          </div>

          {/* Info rápida del cliente */}
          <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Phone className="w-6 h-6 text-white/60 mx-auto mb-2" />
                <div className="text-white font-bold">{clienteInfo.telefono}</div>
                <div className="text-white/60 text-xs uppercase tracking-wider">CONTACTO</div>
              </div>
              <div>
                <Car className="w-6 h-6 text-white/60 mx-auto mb-2" />
                <div className="text-white font-bold">{clienteInfo.vehiculos.length} vehículos</div>
                <div className="text-white/60 text-xs uppercase tracking-wider">REGISTRADOS</div>
              </div>
              <div>
                <Calendar className="w-6 h-6 text-white/60 mx-auto mb-2" />
                <div className="text-white font-bold">{citasCliente.length} citas</div>
                <div className="text-white/60 text-xs uppercase tracking-wider">ACTIVAS</div>
              </div>
            </div>
          </div>
        </header>

        {/* Sección de citas */}
        <main className="max-w-7xl mx-auto">
          {citasCliente.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                  TUS CITAS PROGRAMADAS
                </h2>
                <p className="text-white/70">Mantente al día con tus servicios premium</p>
              </div>

              <div className={`grid gap-8 ${citasCliente.length === 1 ? 'max-w-2xl mx-auto' : 'grid-cols-1 lg:grid-cols-2'}`}>
                {citasCliente.map((cita, index) => (
                  <CitaClienteCard key={cita.id} cita={cita} index={index} />
                ))}
              </div>
            </>
          ) : (
            // Estado sin citas
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white/5 rounded-full mb-6">
                <Calendar className="w-16 h-16 text-white/30" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">
                NO TIENES CITAS PROGRAMADAS
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Agenda tu próximo lavado premium y dale a tu vehículo el cuidado que merece
              </p>
              <button className="bg-white text-black font-black py-4 px-8 rounded-xl text-lg uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105">
                AGENDAR CITA
              </button>
            </div>
          )}

          {/* Botón de nueva cita */}
          {citasCliente.length > 0 && citasCliente.length < 2 && (
            <div className="text-center mt-12">
              <button className="flex items-center gap-3 mx-auto bg-white text-black font-black py-4 px-8 rounded-xl text-lg uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105">
                <Plus className="w-5 h-5" />
                AGENDAR OTRA CITA
              </button>
            </div>
          )}
        </main>

        {/* Acciones rápidas */}
        <footer className="mt-16 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-white font-black text-xl uppercase tracking-wider mb-2">
              ACCIONES RÁPIDAS
            </h3>
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-3 p-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40">
              <Calendar className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Historial</span>
            </button>
            <button className="flex items-center justify-center gap-3 p-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40">
              <Car className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Mis Vehículos</span>
            </button>
            <button className="flex items-center justify-center gap-3 p-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40">
              <Settings className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Perfil</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InicioCliente;