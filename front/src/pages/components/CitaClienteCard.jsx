import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Car, User, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; // Updated import
import { useCarro } from '../../context/CarroContext'; // nuevo import para obtener datos del carro

const CitaClienteCard = ({ cita }) => {
  const { isDarkMode } = useTheme();
  const { getCarroById } = useCarro(); // asumo este método existe en el contexto
  const [carroData, setCarroData] = useState(null);
  const [loadingCarro, setLoadingCarro] = useState(false);

  console.log('Cita data:', cita);

  useEffect(() => {
    let mounted = true;
    const fetchCarro = async () => {
      if (!cita) return;
      // cita.carro puede ser ID (string) o objeto; manejar ambos casos
      const carroId = typeof cita.carro === 'string' ? cita.carro : cita.carro?._id;
      // si ya es objeto, úsalo directamente
      if (!carroId && typeof cita.carro === 'object') {
        setCarroData(cita.carro);
        return;
      }
      if (!carroId) {
        setCarroData(null);
        return;
      }

      try {
        setLoadingCarro(true);
        const result = await getCarroById(carroId);
        if (mounted) setCarroData(result || null);
      } catch (error) {
        console.error('Error fetching carro:', error);
        if (mounted) setCarroData(null);
      } finally {
        if (mounted) setLoadingCarro(false);
      }
    };

    fetchCarro();
    return () => {
      mounted = false;
    };
  }, [cita, getCarroById]);

  // usar carroData si está disponible, si no fallback seguro
  const carro = carroData ?? (typeof cita?.carro === 'object' ? cita.carro : null);

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-MX', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Función para obtener la hora
  const obtenerHora = (fecha) => {
    if (!fecha) return '--:--';
    return new Date(fecha).toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`${
      isDarkMode 
        ? 'bg-black/40 border-white/10' 
        : 'bg-white/80 border-gray-200'
    } group relative backdrop-blur-xl rounded-2xl border p-6 transition-all duration-500 hover:scale-105 min-h-[400px]`}>
      {/* Servicio principal */}
      <div className="mb-6 text-center">
        <h2 className={`${
          isDarkMode ? 'text-white' : 'text-gray-900'
        } font-black text-3xl tracking-wide mb-2`}>
          {cita?.tipoServicio || 'Servicio'}
        </h2>
        <div className={`h-0.5 w-20 bg-gradient-to-r mx-auto ${isDarkMode ? 'from-transparent via-white to-transparent' : 'from-transparent via-gray-400 to-transparent'}`}></div>
      </div>

      {/* Detalles de la cita */}
      <div className="space-y-4 mb-6">
        {/* Vehículo */}
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <Car className={isDarkMode ? 'text-white/60' : 'text-gray-500'} />
          <div>
            {loadingCarro ? (
              <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>Cargando vehículo...</div>
            ) : carro ? (
              <>
                <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  {carro.marca ?? 'Marca'} {carro.modelo ?? ''}
                </div>
                <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
                  {carro.placas ?? '—'}
                </div>
              </>
            ) : (
              <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>Vehículo no disponible</div>
            )}
          </div>
        </div>

        {/* Fecha y hora */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <Calendar className={isDarkMode ? 'text-white/60' : 'text-gray-500'} />
            <div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {formatearFecha(cita?.fechaInicio)}
              </div>
              <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
                FECHA
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <Clock className={isDarkMode ? 'text-white/60' : 'text-gray-500'} />
            <div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {obtenerHora(cita?.fechaInicio)}
              </div>
              <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
                Hora para llegar
              </div>
            </div>
          </div>
        </div>

        {/* Estado y Costo */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <MapPin className={isDarkMode ? 'text-white/60' : 'text-gray-500'} />
            <div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {cita?.estado ?? '—'}
              </div>
              <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
                ESTADO
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <User className={isDarkMode ? 'text-white/60' : 'text-gray-500'} />
            <div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                ${cita?.costo ?? '0'}
              </div>
              <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
                COSTO
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      {cita?.informacionAdicional && (
        <div className={`mb-6 p-4 rounded-xl border ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>
            NOTAS ESPECIALES
          </div>
          <p className={isDarkMode ? 'text-white/90' : 'text-gray-700'}>
            {cita.informacionAdicional}
          </p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3">

        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider">
          CANCELAR
        </button>
      </div>
    </div>
  );
};

export default CitaClienteCard;