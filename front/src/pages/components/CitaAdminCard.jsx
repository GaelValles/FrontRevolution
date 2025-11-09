import { Clock, Car, User, Phone, MapPin } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';

// Update the getDragStyle function for smoother dragging
const getDragStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  cursor: isDragging ? 'grabbing' : 'grab',
  transform: isDragging ? 'rotate(0.5deg)' : 'none', // Reduced rotation
  transition: 'transform 0.2s ease',
  ...draggableStyle // Important: Spread the draggableStyle at the end
});

export const CitaAdminCard = ({ cita, index, estadoConfig }) => {
  return (
    <Draggable 
      draggableId={cita._id} 
      index={index}
      type="CITA" // Add this to match the Droppable type
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getDragStyle(snapshot.isDragging, provided.draggableProps.style)}
          className="group relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 hover:shadow-white/10 hover:shadow-2xl transition-all duration-500"
        >
          {/* Header de la tarjeta */}
          <div className="flex items-center justify-between mb-4">
            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${estadoConfig.color} text-white`}>
              {new Date(cita.fechaInicio).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-white font-black text-lg">
              ${cita.costo?.toLocaleString() || '0'}
            </div>
          </div>

          {/* Cliente */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <User className="text-white/60 text-sm w-4 h-4" />
              <h3 className="text-white font-bold text-lg tracking-wide">
                {cita.cliente?.nombre || 'Cliente no disponible'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Phone className="text-xs w-3 h-3" />
              <span className="text-sm font-medium">{cita.cliente?.telefono || 'N/A'}</span>
            </div>
          </div>

          {/* Vehículo */}
          <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Car className="text-white/60 w-5 h-5" />
              <span className="text-white font-bold text-lg">
                {`${cita.carro?.marca || ''} ${cita.carro?.modelo || ''}`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-white/70">
                <span className="block text-white/50">Año:</span>
                {cita.carro?.año || 'N/A'}
              </div>
              <div className="text-white/70">
                <span className="block text-white/50">Placas:</span>
                {cita.carro?.placas || 'N/A'}
              </div>
              <div className="text-white/70">
                <span className="block text-white/50">Color:</span>
                {cita.carro?.color || 'N/A'}
              </div>
              <div className="text-white/70">
                <span className="block text-white/50">Tipo:</span>
                {cita.carro?.tipo || 'N/A'}
              </div>
            </div>
          </div>

          {/* Servicio */}
          <div className="mb-3">
            <div className="inline-block px-3 py-1 bg-white/10 rounded-lg border border-white/20">
              <span className="text-white/90 text-sm font-bold uppercase tracking-wide">
                {cita.tipoServicio}
              </span>
            </div>
          </div>

          {/* Fechas */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="text-white/70">
              <Clock className="inline w-4 h-4 mr-2 text-white/40" />
              <span className="block text-white/50 text-xs mb-1">Inicio:</span>
              {new Date(cita.fechaInicio).toLocaleString()}
            </div>
            <div className="text-white/70">
              <Clock className="inline w-4 h-4 mr-2 text-white/40" />
              <span className="block text-white/50 text-xs mb-1">Fin:</span>
              {new Date(cita.fechaFin).toLocaleString()}
            </div>
          </div>

          {/* Ubicación */}
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="text-white/60 text-sm w-4 h-4" />
            <span className="text-white/70 text-sm">
              {cita.cliente?.direccion || 'Dirección no disponible'}
            </span>
          </div>

          {/* Observaciones */}
          {cita.informacionAdicional && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/80 text-xs leading-relaxed">
                {cita.informacionAdicional}
              </p>
            </div>
          )}

          {/* Elemento decorativo */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      )}
    </Draggable>
  );
};