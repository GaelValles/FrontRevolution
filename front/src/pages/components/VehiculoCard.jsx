import React from 'react';
import { Car } from 'lucide-react';

const VehiculoCard = ({ vehiculo, onDelete }) => {
    if (!vehiculo) return null;

    return (
        <div className="group relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:border-white/40 hover:shadow-white/10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            {/* Header vehículo */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-white font-black text-xl">
                    {vehiculo.marca} {vehiculo.modelo}
                </div>
            </div>

            {/* Detalles del vehículo */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <Car className="text-white/60 w-5 h-5" />
                    <div>
                        <div className="text-white font-bold">{vehiculo.placas}</div>
                        <div className="text-white/60 text-xs uppercase">PLACAS</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-white/60">Año</div>
                        <div className="text-white font-bold">{vehiculo.año}</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-white/60">Color</div>
                        <div className="text-white font-bold">{vehiculo.color}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white/60">Tipo</div>
                    <div className="text-white font-bold capitalize">{vehiculo.tipo}</div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider border border-white/20 hover:border-white/40">
                    MODIFICAR
                </button>
                <button 
                    onClick={() => onDelete(vehiculo._id)}
                    className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider"
                >
                    ELIMINAR
                </button>
            </div>

            {/* Elemento decorativo */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"></div>
        </div>
    );
};

export default VehiculoCard;