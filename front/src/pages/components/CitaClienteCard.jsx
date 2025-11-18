import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Car, User, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCarro } from '../../context/CarroContext';
import { useCitas } from '../../context/CitasContext';

const CitaClienteCard = ({ cita, onCancel }) => {
  const { isDarkMode } = useTheme();
  const { getCarroById } = useCarro();
  const { cancelCita } = useCitas();
  const [carroData, setCarroData] = useState(null);
  const [loadingCarro, setLoadingCarro] = useState(false);

  // Confirm dialog state (restaurado a comportamiento original)
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchCarro = async () => {
      if (!cita) return;
      const carroId = typeof cita.carro === 'string' ? cita.carro : cita.carro?._id;
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

  const carro = carroData ?? (typeof cita?.carro === 'object' ? cita.carro : null);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-MX', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const obtenerHora = (fecha) => {
    if (!fecha) return '--:--';
    return new Date(fecha).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handlers: usa cancelCita del context si está disponible, si no llama onCancel prop
  const handleRequestCancel = (e) => {
    e?.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmCancel = async (e) => {

    e?.stopPropagation();
    setShowConfirm(false);
    console.log('User confirmed cancellation for cita:', cita._id);
    // Prioriza cancelCita del context (limpio y mantenible). Mantiene fallback a onCancel prop.
    if (typeof cancelCita === 'function') {
      const result = await cancelCita(cita._id);
      if (result.success) {
        // Notificar padre si lo desea (por compatibilidad)
        if (typeof onCancel === 'function') {
          try { onCancel(cita._id, { penaltyUntil: result.penaltyUntil }); } catch (err) { /* ignore */ }
        }
      } else {
        // muestra error en consola; el padre puede manejar estados adicionales si es necesario
        console.error('Cancelación fallida:', result.error);
      }
      return;
    }

    // Fallback original
    if (typeof onCancel === 'function') {
      try {
        await onCancel(cita._id);
      } catch (err) {
        console.error('Error en onCancel prop:', err);
      }
    } else {
      console.log('Cancel confirmed for cita:', cita._id);
    }
  };

  return (
    <>
      <div className={`${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-gray-200'} group relative backdrop-blur-xl rounded-2xl border p-6 transition-all duration-500 hover:scale-105 min-h-[400px]`}>
        {/* Servicio principal */}
        <div className="mb-6 text-center">
          <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black text-3xl tracking-wide mb-2`}>
            {cita?.tipoServicio || 'Servicio'}
          </h2>
          <div className={`h-0.5 w-20 bg-gradient-to-r mx-auto ${isDarkMode ? 'from-transparent via-white to-transparent' : 'from-transparent via-gray-400 to-transparent'}`}></div>
        </div>

        {/* Detalles de la cita */}
        <div className="space-y-4 mb-6">
          {/* Vehículo */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
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
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
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
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
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
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
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
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
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

        {cita?.informacionAdicional && (
          <div className={`mb-6 p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
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
          <button
            onClick={handleRequestCancel}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider"
          >
            CANCELAR
          </button>
        </div>
      </div>

      {/* Confirmación personalizada (modal) */}
      {showConfirm && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowConfirm(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className={`relative max-w-lg w-full rounded-2xl p-6 z-10 ${isDarkMode ? 'bg-[#0b0b0b] border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">Confirmar cancelación</h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
              Si cancelas esta cita se aplicará una penalización temporal que puede impedirte agendar nuevas citas por un periodo. ¿Deseas continuar con la cancelación?
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-800'} hover:opacity-90 transition`}>
                Volver
              </button>
              <button onClick={handleConfirmCancel} className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-500 transition">
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CitaClienteCard;