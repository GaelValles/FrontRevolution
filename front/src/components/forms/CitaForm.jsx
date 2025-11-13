import React, { useEffect } from 'react';
import { tiposServicio as tiposServicioDefault, costosPorServicio } from '../../constants/servicios';

export const CitaForm = ({
  formData = {},
  errors = {},
  loading = false,
  handleInputChange,
  handleSubmit,
  vehiculosCliente = [],
  tiposServicio = [],
  costosPorServicio: costosProp = {}
}) => {
  useEffect(() => {}, [formData.fechaInicio]);

  const serviciosOptions = Array.isArray(tiposServicio) && tiposServicio.length ? tiposServicio : tiposServicioDefault;
  const costos = Object.keys(costosProp || {}).length ? costosProp : costosPorServicio;

  // Wrapper que normaliza eventos para que el padre reciba siempre { target: { name, value } }
  const onFieldChange = (name, value) => {
    const syntheticEvent = { target: { name, value } };
    handleInputChange(syntheticEvent);
  };

  // Helpers para obtener el value correcto si formData guarda objeto o id
  const getVehiculoValue = () => {
    // IMPORTANT: ahora usamos 'carro' porque el hook/validación espera ese campo
    const v = formData.carro ?? formData.vehiculo;
    if (!v) return '';
    return (typeof v === 'object' && v?._id) ? v._id : String(v);
  };
  const getServicioValue = () => {
    const s = formData.tipoServicio;
    return s ?? '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 p-8 relative">
      <div className="absolute top-0 left-0 w-full h-px " />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/60 text-sm mb-2">Fecha y Hora</label>
          <input
            type="datetime-local"
            name="fechaInicio"
            value={formData.fechaInicio || ''}
            onChange={(e) => onFieldChange('fechaInicio', e.target.value)}
            className={`w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/50`}
          />
          {errors.fechaInicio && <p className="text-rose-400 text-sm mt-1">{errors.fechaInicio}</p>}
          {errors.submit && <p className="text-rose-400 text-sm mt-2">{errors.submit}</p>}
        </div>

        <div>
          <label className="block text-white/60 text-sm mb-2">Tipo de servicio</label>
          <select
            name="tipoServicio"
            value={getServicioValue()}
            onChange={(e) => onFieldChange('tipoServicio', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 appearance-none"
          >
            <option value="" className="bg-gray-900 text-white">Selecciona</option>
            {serviciosOptions.map(ts => <option key={ts} value={ts} className="bg-gray-900 text-white">{ts}</option>)}
          </select>
          {errors.tipoServicio && <p className="text-rose-400 text-sm mt-1">{errors.tipoServicio}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div>
          <label className="block text-white/60 text-sm mb-2">Vehículo</label>
          {/* name cambiado a "carro" para coincidir con useCitaForm */}
          <select
            name="carro"
            value={getVehiculoValue()}
            onChange={(e) => onFieldChange('carro', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 appearance-none"
          >
            <option value="" className="bg-gray-900 text-white">Selecciona tu vehículo</option>
            {vehiculosCliente.map(v => (
              <option key={v._id} value={v._id} className="bg-gray-900 text-white">
                {v.marca} {v.modelo} — {v.placas}
              </option>
            ))}
          </select>
          {errors.carro && <p className="text-rose-400 text-sm mt-1">{errors.carro}</p>}
        </div>


      </div>

      <div>
        <label className="block text-white/60 text-sm mb-2">Información adicional</label>
        <textarea
          name="informacionAdicional"
          value={formData.informacionAdicional || ''}
          onChange={(e) => onFieldChange('informacionAdicional', e.target.value)}
          className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/50"
          rows={4}
        />
      </div>
        <div>
          <label className="block text-white/60 text-sm mb-2">Costo</label>
          <input
            name="costo"
            readOnly
            value={formData.costo || (formData.tipoServicio ? (costos[formData.tipoServicio] ?? '') : '')}
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none"
          />
        </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white/90 hover:bg-white text-black font-black py-4 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Agendar cita'}
        </button>
      </div>
    </form>
  );
};

export default CitaForm;