import React from 'react';
import { Car } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const VehiculoCard = ({ vehiculo, onDelete }) => {
    const { isDarkMode } = useTheme();

    if (!vehiculo) return null;

    return (
        <div className={`${
          isDarkMode 
            ? 'bg-black/40 border-white/10' 
            : 'bg-white/80 border-gray-200'
        } group relative backdrop-blur-xl rounded-2xl border p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
          isDarkMode
            ? 'hover:border-white/40 hover:shadow-white/10'
            : 'hover:border-gray-300 hover:shadow-gray-200'
        }`}>
            {/* Header vehículo */}
            <div className="flex items-center justify-between mb-4">
                <div className={`${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                } font-black text-xl`}>
                    {vehiculo.marca} {vehiculo.modelo}
                </div>
            </div>

            {/* Detalles del vehículo */}
            <div className="space-y-4 mb-6">
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                    isDarkMode 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <Car className={`${
                        isDarkMode ? 'text-white/60' : 'text-gray-600'
                    } w-5 h-5`} />
                    <div>
                        <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                            {vehiculo.placas}
                        </div>
                        <div className={`${
                            isDarkMode ? 'text-white/60' : 'text-gray-500'
                        } text-xs uppercase`}>
                            PLACAS
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                        isDarkMode 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
                            Año
                        </div>
                        <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                            {vehiculo.año}
                        </div>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                        isDarkMode 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
                            Color
                        </div>
                        <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                            {vehiculo.color}
                        </div>
                    </div>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                    isDarkMode 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
                        Tipo
                    </div>
                    <div className={`${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    } font-bold capitalize`}>
                        {vehiculo.tipo}
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
                <button className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider border ${
                    isDarkMode 
                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200 hover:border-gray-300'
                }`}>
                    MODIFICAR
                </button>
                <button 
                    onClick={() => onDelete(vehiculo._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider"
                >
                    ELIMINAR
                </button>
            </div>

            {/* Elemento decorativo */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl ${
                isDarkMode
                    ? 'from-transparent via-white/30 to-transparent'
                    : 'from-transparent via-gray-300 to-transparent'
            }`}></div>
        </div>
    );
};

export default VehiculoCard;