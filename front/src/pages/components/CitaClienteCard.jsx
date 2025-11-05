import React from 'react';
import { Calendar, Clock, Car, User, MapPin } from 'lucide-react';

const CitaClienteCard = ({ cita }) => {
  return (
    <div className="group relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-white/40 hover:shadow-white/10 hover:shadow-2xl transition-all duration-500 hover:scale-105 min-h-[400px]">
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

export default CitaClienteCard;