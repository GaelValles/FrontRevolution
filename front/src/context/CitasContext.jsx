import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  addCitaRequest,
  getCitasRequest,
  getCitasByCarroRequest,
  getCitasByClienteRequest,
  getAllCitasRequest,
  updateCitaEstadoRequest
} from '../api/auth.citas';

const CitasContext = createContext();

export const useCitas = () => useContext(CitasContext);

export const CitasProvider = ({ children }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCitas = async () => {
    setLoading(true);
    try {
      const res = await getCitasRequest();
      setCitas(res.data || []);
    } catch (err) {
      console.error('Error cargando citas:', err?.response?.data || err.message);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  const addCita = async (citaData) => {
    try {
      setLoading(true);

      // Pre-validación con el backend: obtener citas del carro para evitar conflictos en cliente
      if (!citaData.carro) {
        return { success: false, error: { carro: 'Vehículo requerido' } };
      }

      let existingCitas = [];
      try {
        const r = await getCitasByCarroRequest(
          typeof citaData.carro === 'string' ? citaData.carro : citaData.carro._id
        );
        existingCitas = r.data || [];
      } catch (err) {
        // Si server responde 404 o 500, propagar error claro
        console.error('Error obteniendo citas por carro (prevalidation):', err?.response?.data || err.message);
        return { success: false, error: { server: 'No se pudo validar disponibilidad del vehículo' } };
      }

      // Aquí puedes agregar más validaciones locales si quieres (solapamientos, rango horario, etc.)

      const res = await addCitaRequest(citaData);
      setCitas(prev => [...prev, res.data]);
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error al crear cita:', error?.response?.data || error.message);
      const serverMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
      return { success: false, error: { submit: serverMessage } };
    } finally {
      setLoading(false);
    }
  };

  const getCitasPorCliente = async (clienteId) => {
    try {
      const res = await getCitasByClienteRequest(clienteId);
      return { success: true, data: res.data || [] };
    } catch (err) {
      console.error('Error fetching citas por cliente:', err?.response?.data || err.message);
      return { success: false, error: err?.response?.data || err.message };
    }
  };

  // Obtener todas las citas (wrapper usado por la UI admin)
  const getAllCitas = async () => {
    setLoading(true);
    try {
      const res = await getAllCitasRequest();
      const data = res.data || [];
      setCitas(data);
      return data;
    } catch (err) {
      console.error('Error getAllCitas:', err?.response?.data || err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado de una cita y mantener estado local sincronizado
  const updateCitaEstado = async (id, estado) => {
    try {
      setLoading(true);
      const res = await updateCitaEstadoRequest(id, estado);
      const updated = res.data;
      setCitas(prev => prev.map(c => (c._id === updated._id ? updated : c)));
      return updated;
    } catch (err) {
      console.error('Error updateCitaEstado:', err?.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // helper: parsear fecha a Date en zona local (acepta ISO o "YYYY-MM-DDTHH:MM")
  const parseLocalDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value !== 'string') return null;

    // Intentar parseo nativo (maneja ISO)
    const dt = new Date(value);
    if (!isNaN(dt.getTime())) return dt;

    // Fallback para "YYYY-MM-DDTHH:MM" o "YYYY-MM-DD"
    const [datePart, timePart = '00:00'] = value.split('T');
    const [y, m, d] = (datePart || '').split('-').map(Number);
    const [hh = 0, mm = 0] = (timePart || '').split(':').map(Number);
    if ([y, m, d].every(n => Number.isFinite(n))) {
      return new Date(y, (m || 1) - 1, d, hh, mm, 0, 0);
    }
    return null;
  };

  // Validación reutilizable para crear/editar citas (devuelve { isValid, errors })
  const validateCitaData = (citaData = {}) => {
    const errors = {};

    // fechaInicio
    if (!citaData.fechaInicio) {
      errors.fechaInicio = 'La fecha de inicio es requerida';
    } else {
      const dt = parseLocalDate(citaData.fechaInicio);
      if (!dt || isNaN(dt.getTime())) {
        errors.fechaInicio = 'Formato de fecha inválido';
      } else {
        const totalMinutes = dt.getHours() * 60 + dt.getMinutes();
        const minMinutes = 9 * 60;
        const maxMinutes = 17 * 60;
        if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
          errors.fechaInicio = 'Selecciona una hora entre 09:00 y 17:00';
        }
      }
    }

    if (!citaData.tipoServicio) {
      errors.tipoServicio = 'El tipo de servicio es requerido';
    }

    if (!citaData.carro) {
      errors.carro = 'Debe seleccionar un vehículo';
    }

    if (!citaData.cliente) {
      errors.cliente = 'Error: No se ha identificado el cliente';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  return (
    <CitasContext.Provider value={{
      citas,
      loading,
      addCita,
      loadCitas,
      getCitasPorCliente,
      getCitasByCarroRequest,
      validateCitaData,
      getAllCitas,
      updateCitaEstado
     }}>
       {children}
     </CitasContext.Provider>
   );
};

export default CitasContext;