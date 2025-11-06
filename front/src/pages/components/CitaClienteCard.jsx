import React from 'react';
import { Calendar, Clock, Car, User, MapPin } from 'lucide-react';

const CitaClienteCard = ({ cita }) => {
  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Función para calcular la duración
  const calcularDuracion = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const duracionMinutos = Math.round((fin - inicio) / (1000 * 60));
    return `${duracionMinutos} minutos`;
  };

  // Función para obtener la hora
  const obtenerHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="group relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-white/40 hover:shadow-white/10 hover:shadow-2xl transition-all duration-500 hover:scale-105 min-h-[400px]">
      {/* Servicio principal */}
      <div className="mb-6 text-center">
        <h2 className="text-white font-black text-3xl tracking-wide mb-2">
          {cita.tipoServicio}
        </h2>
        <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
      </div>

      {/* Detalles de la cita */}
      <div className="space-y-4 mb-6">
        {/* Vehículo */}
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
          <Car className="text-white/60 w-5 h-5" />
          <div>
            <div className="text-white font-bold">
              {cita.carro?.marca} {cita.carro?.modelo}
            </div>
            <div className="text-white/60 text-xs uppercase">
              {cita.carro?.placas}
            </div>
          </div>
        </div>

        {/* Fecha y hora */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <Calendar className="text-white/60 w-5 h-5" />
            <div>
              <div className="text-white font-bold">
                {formatearFecha(cita.fechaInicio)}
              </div>
              <div className="text-white/60 text-xs uppercase">FECHA</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <Clock className="text-white/60 w-5 h-5" />
            <div>
              <div className="text-white font-bold">{obtenerHora(cita.fechaInicio)}</div>
              <div className="text-white/60 text-xs uppercase">
                {calcularDuracion(cita.fechaInicio, cita.fechaFin)}
              </div>
            </div>
          </div>
        </div>

        {/* Estado y Costo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <MapPin className="text-white/60 w-5 h-5" />
            <div>
              <div className="text-white font-bold capitalize">{cita.estado}</div>
              <div className="text-white/60 text-xs uppercase">ESTADO</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <User className="text-white/60 w-5 h-5" />
            <div>
              <div className="text-white font-bold">${cita.costo}</div>
              <div className="text-white/60 text-xs uppercase">COSTO</div>
            </div>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      {cita.informacionAdicional && (
        <div className="mb-6 p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10">
          <div className="text-white/60 text-xs uppercase tracking-wider mb-1">NOTAS ESPECIALES</div>
          <p className="text-white/90 text-sm font-medium leading-relaxed">
            {cita.informacionAdicional}
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

export default CitaClienteCard;