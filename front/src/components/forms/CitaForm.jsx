import { tiposServicio, costosPorServicio } from '../../constants/servicios';
import { getMinDateTime } from '../../utils/dateUtils';

export const CitaForm = ({ formData, errors, loading, handleInputChange, handleSubmit, vehiculosCliente }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selección de vehículo */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Vehículo</label>
        <select
          name="carro"
          value={formData.carro}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 appearance-none"
        >
          <option value="" className="bg-gray-900">Selecciona tu vehículo</option>
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
        <label className="block text-white/60 text-sm mb-2">Fecha y Hora de Inicio</label>
        <input
          type="datetime-local"
          name="fechaInicio"
          value={formData.fechaInicio}
          onChange={handleInputChange}
          min={getMinDateTime()}
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
        />
        {errors.fechaInicio && (
          <span className="text-red-400 text-xs mt-1 block">{errors.fechaInicio}</span>
        )}
      </div>

      {/* Fecha y hora de fin */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Fecha y Hora de Fin</label>
        <input
          type="datetime-local"
          name="fechaFin"
          value={formData.fechaFin}
          onChange={handleInputChange}
          min={formData.fechaInicio || getMinDateTime()}
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
        />
        {errors.fechaFin && (
          <span className="text-red-400 text-xs mt-1 block">{errors.fechaFin}</span>
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
        disabled={loading}
        className="w-full bg-white/90 hover:bg-white text-black font-black py-4 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Programando...' : 'Programar Cita'}
      </button>
    </form>
  );
};