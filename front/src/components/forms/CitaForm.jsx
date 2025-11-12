import { tiposServicio, costosPorServicio } from '../../constants/servicios';
import { getMinDateTime } from '../../utils/dateUtils';
import { useDias } from '../../context/DiasContext';
import { useAuth } from '../../context/AuthContext'; // Add this import
import { useEffect, useState } from 'react';

// helper: Date -> "YYYY-MM-DDTHH:MM" (local) and normalize min to step
const toDateTimeLocalString = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
};

const normalizeMinString = (minStr, stepMinutes = 15) => {
  if (!minStr) return '';
  const dt = new Date(minStr);
  if (isNaN(dt.getTime())) return '';
  // round minutes UP to nearest step to ensure min aligns with step grid
  const min = dt.getMinutes();
  const rem = min % stepMinutes;
  if (rem !== 0) {
    dt.setMinutes(min + (stepMinutes - rem), 0, 0);
  } else {
    dt.setSeconds(0, 0);
  }
  return toDateTimeLocalString(dt);
};

export const CitaForm = ({ formData, errors, loading, handleInputChange, handleSubmit, vehiculosCliente }) => {
  const { diasInhabiles } = useDias();
  const { cliente } = useAuth(); // Get the logged-in client
  const [timeError, setTimeError] = useState('');

  // compute safe normalized value/min for input[type="datetime-local"]
  const stepMinutes = 15;
  const inputValue = (() => {
    if (!formData?.fechaInicio) return '';
    const dt = new Date(formData.fechaInicio);
    if (isNaN(dt.getTime())) return String(formData.fechaInicio);
    return toDateTimeLocalString(dt);
  })();
  const safeMin = normalizeMinString(getMinDateTime(), stepMinutes);

  // Set client ID in form data when component mounts
  useEffect(() => {
    if (cliente?._id) {
      handleInputChange({
        target: {
          name: 'cliente',
          value: cliente._id
        }
      });
      console.log('Cliente ID set:', cliente._id); // Debug log
    }
  }, [cliente]);

  // Función para deshabilitar fechas
  const isDateDisabled = (date) => {
    return diasInhabiles.some(dia => 
      new Date(dia.fecha).toDateString() === new Date(date).toDateString()
    );
  };

  // Validate datetime-local input: forbid días inhábiles y validar hora entre 09:00 - 17:00
  const handleFechaChange = (e) => {
    const value = e.target.value; // formato "YYYY-MM-DDTHH:MM"
    if (!value) {
      setTimeError('');
      handleInputChange(e);
      return;
    }

    const [datePart, timePart = '00:00'] = value.split('T'); // asegurar timePart
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm] = timePart.split(':').map(Number);

    // Crear Date en hora local para evitar desplazamientos por zona horaria
    const selectedDate = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
    if (isNaN(selectedDate.getTime())) {
      setTimeError('Fecha inválida');
      return;
    }

    // validar solo contra días inhábiles (comparando fecha local)
    const isDisabled = diasInhabiles.some(dia =>
      new Date(dia.fecha).toLocaleDateString() === selectedDate.toLocaleDateString()
    );
    if (isDisabled) {
      setTimeError('La fecha seleccionada está marcada como inhábil');
      return;
    }

    // validar rango horario: 09:00 (inclusive) - 17:00 (inclusive)
    const totalMinutes = (hh || 0) * 60 + (mm || 0);
    const minMinutes = 9 * 60;   // 09:00
    const maxMinutes = 17 * 60;  // 17:00
    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      setTimeError('Selecciona una hora entre 09:00 y 17:00');
      return;
    }

    // válido: limpiar error y propagar cambio
    setTimeError('');
    handleInputChange(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selección de vehículo */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Vehículo</label>
        <select
          name="carro"
          value={formData.carro || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 appearance-none"
        >
          <option value="">Selecciona tu vehículo</option>
          {vehiculosCliente.map((carro) => (
            <option 
              key={carro._id} 
              value={carro._id}
              className="bg-gray-900"
            >
              {`${carro.marca} ${carro.modelo} - ${carro.placas}`}
            </option>
          ))}
        </select>
        {errors.carro && (
          <span className="text-red-400 text-xs mt-1 block">{errors.carro}</span>
        )}
      </div>

      {/* Tipo de servicio */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Tipo de Servicio</label>
        <select
          name="tipoServicio"
          value={formData.tipoServicio}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 appearance-none"
        >
          <option value="" className="bg-gray-900">Selecciona el servicio</option>
          {tiposServicio.map((tipo) => (
            <option 
              key={tipo} 
              value={tipo}
              className="bg-gray-900"
            >
              {tipo} - ${costosPorServicio[tipo]}
            </option>
          ))}
        </select>
        {errors.tipoServicio && (
          <span className="text-red-400 text-xs mt-1 block">{errors.tipoServicio}</span>
        )}
      </div>

      {/* Fecha y hora de inicio */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Fecha y Hora</label>
        <input
          type="datetime-local"
          name="fechaInicio"
          value={inputValue}
          onChange={handleFechaChange}
          min={safeMin} /* normalized min aligned to step */
          step={stepMinutes * 60} /* 15-minute steps in seconds */
          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 $$
            {(errors.fechaInicio || timeError) 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
              : 'border-white/30 focus:border-white/50 focus:ring-white/50'
          }`}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-white/50">
            Disponible: 09:00 - 17:00
          </div>
        </div>
        {(errors.fechaInicio || timeError) && (
          <span className="text-red-400 text-xs mt-1 block">
            {timeError || errors.fechaInicio}
          </span>
        )}
        {diasInhabiles.length > 0 && (
          <p className="text-white/50 text-xs mt-2">
            Nota: Las fechas marcadas como inhábiles no están disponibles para agendar citas
          </p>
        )}
      </div>

      {/* Información adicional */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Información Adicional</label>
        <textarea
          name="informacionAdicional"
          value={formData.informacionAdicional}
          onChange={handleInputChange}
          placeholder="Detalles adicionales sobre el servicio..."
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 min-h-[100px] resize-none"
        />
      </div>

      {/* Error general */}
      {errors.submit && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Botón de submit */}
      <button
        type="submit"
        disabled={loading || Boolean(timeError)}
        className="w-full bg-white/90 hover:bg-white text-black font-black py-4 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Programando...' : 'Programar Cita'}
      </button>
    </form>
  );
};