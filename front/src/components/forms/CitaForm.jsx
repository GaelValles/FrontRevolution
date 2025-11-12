import React, { useEffect } from 'react';
import { tiposServicio as tiposServicioDefault, costosPorServicio } from '../../constants/servicios';

export const crearCita = async (req, res) => {
  try {
    const { fechaInicio, tipoServicio, costo, carro, informacionAdicional } = req.body;

    // Validar ObjectId y fecha
    if (!mongoose.Types.ObjectId.isValid(carro)) {
      return res.status(400).json({ message: "ID de carro inválido" });
    }
    const fechaObj = new Date(fechaInicio);
    if (isNaN(fechaObj.getTime())) {
      return res.status(400).json({ message: "Fecha inválida" });
    }

    // Owner id desde token (soporta id o _id)
    const ownerId = req.admin?.id || req.admin?._id;

    // Verificar que el carro existe y pertenece al usuario
    const carroExiste = await Carros.findOne({ _id: carro, propietario: ownerId });
    if (!carroExiste) {
      return res.status(404).json({ message: "Carro no encontrado" });
    }

    // Ventana de tolerancia (ej. 15 minutos) para evitar solapamientos
    const TOLERANCE_MS = 15 * 60 * 1000;
    const windowStart = new Date(fechaObj.getTime() - TOLERANCE_MS);
    const windowEnd = new Date(fechaObj.getTime() + TOLERANCE_MS);

    // Buscar conflictos SOLO para el MISMO carro y sólo estados activos (no cancelada/completada)
    const conflicto = await Citas.findOne({
      carro: carro,
      fechaInicio: { $gte: windowStart, $lte: windowEnd },
      estado: { $nin: ['cancelada', 'completada'] }
    });

    if (conflicto) {
      return res.status(400).json({
        message: "Ya existe una cita programada para ese vehículo en un horario muy cercano"
      });
    }

    // Crear y guardar cita (fecha enviada desde frontend debe ser ISO)
    const nuevaCita = new Citas({
      fechaInicio: fechaObj,
      tipoServicio,
      costo,
      carro,
      cliente: ownerId,
      informacionAdicional,
      estado: 'programada'
    });

    const citaGuardada = await nuevaCita.save();

    // Actualizar array de citas del cliente (si existe)
    await Admin.findByIdAndUpdate(ownerId, { $push: { citas: citaGuardada._id } });

    const citaCompleta = await Citas.findById(citaGuardada._id)
      .populate('carro', 'marca modelo año color placas tipo')
      .populate('cliente', 'nombre correo telefono');

    return res.json(citaCompleta);
  } catch (error) {
    console.error('Error en crearCita:', error);
    return res.status(500).json({ message: "Error al crear la cita", error: error.message });
  }
};

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
  // No hacer parseo complejo aquí: el hook padre/hook de formulario se encarga
  useEffect(() => {
    // debug mínimo en desarrollo
    // console.log('CitaForm mounted, fechaInicio:', formData.fechaInicio);
  }, [formData.fechaInicio]);

  // elegir lista de servicios: prop tiene preferencia, si no viene usamos el default importado
  const serviciosOptions = Array.isArray(tiposServicio) && tiposServicio.length ? tiposServicio : tiposServicioDefault;
  const costos = Object.keys(costosProp || {}).length ? costosProp : costosPorServicio;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/70 mb-1">Fecha y Hora</label>
        <input
          type="datetime-local"
          name="fechaInicio"
          value={formData.fechaInicio || ''}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 rounded bg-white/5 text-white ${errors.fechaInicio ? 'border-red-500' : 'border-white/30'}`}
        />
        {errors.fechaInicio && <p className="text-red-400 text-sm mt-1">{errors.fechaInicio}</p>}
        {/* Mensaje de submit / servidor */}
        {errors.submit && <p className="text-red-400 text-sm mt-2">{errors.submit}</p>}
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">Tipo de servicio</label>
        <select
          name="tipoServicio"
          value={formData.tipoServicio || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded bg-white/5 text-white"
        >
          <option value="">Selecciona</option>
          {serviciosOptions.map(ts => <option key={ts} value={ts}>{ts}</option>)}
        </select>
        {errors.tipoServicio && <p className="text-red-400 text-sm mt-1">{errors.tipoServicio}</p>}
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">Vehículo</label>
        <select
          name="carro"
          value={formData.carro || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded bg-white/5 text-white"
        >
          <option value="">Selecciona tu vehículo</option>
          {vehiculosCliente.map(v => (
            <option key={v._id} value={v._id}>
              {v.marca} {v.modelo} — {v.placas}
            </option>
          ))}
        </select>
        {errors.carro && <p className="text-red-400 text-sm mt-1">{errors.carro}</p>}
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">Costo</label>
        <input
          name="costo"
          readOnly
          value={formData.costo || (formData.tipoServicio ? (costos[formData.tipoServicio] ?? '') : '')}
          className="w-full px-3 py-2 rounded bg-white/5 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">Información adicional</label>
        <textarea
          name="informacionAdicional"
          value={formData.informacionAdicional || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded bg-white/5 text-white"
        />
      </div>

      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">
          {loading ? 'Guardando...' : 'Agendar cita'}
        </button>
      </div>
    </form>
  );
};

export default CitaForm;