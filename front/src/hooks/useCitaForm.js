import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCitas } from '../context/CitasContext';
import { useDias } from '../context/DiasContext';
import { costosPorServicio } from '../constants/servicios';

// Helper: parse datetime-local or ISO to local Date
const parseLocalDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value !== 'string') return null;

  // If format "YYYY-MM-DDTHH:MM" or ISO
  const dt = new Date(value);
  if (!isNaN(dt.getTime())) return dt;

  const [datePart, timePart = '00:00'] = value.split('T');
  const [y, m, d] = (datePart || '').split('-').map(Number);
  const [hh = 0, mm = 0] = (timePart || '').split(':').map(Number);
  if ([y, m, d].every(Number.isFinite)) {
    return new Date(y, (m || 1) - 1, d, hh, mm, 0, 0);
  }
  return null;
};

// New helper: convert Date -> "YYYY-MM-DDTHH:MM" (local)
const toDateTimeLocalString = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  const pad = (n) => n.toString().padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
};

// Basic validation fallback (will be used only if context validate missing)
const localValidateCitaData = (citaData = {}, diasInhabiles = []) => {
  const errors = {};

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
      // dias inhábiles check (compare date only)
      if (Array.isArray(diasInhabiles) && diasInhabiles.length) {
        const selectedDay = dt.toDateString();
        const isDisabled = diasInhabiles.some(d => {
          const diaDate = parseLocalDate(d.fecha) || new Date(d.fecha);
          return diaDate.toDateString() === selectedDay;
        });
        if (isDisabled) errors.fechaInicio = 'La fecha seleccionada está marcada como inhábil';
      }
    }
  }

  if (!citaData.tipoServicio) errors.tipoServicio = 'El tipo de servicio es requerido';
  if (!citaData.carro) errors.carro = 'Debe seleccionar un vehículo';
  if (!citaData.cliente) errors.cliente = 'No se ha identificado el cliente';

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const useCitaForm = (navigate) => {
  const { cliente } = useAuth();
  const { addCita, validateCitaData } = useCitas();
  const { diasInhabiles, obtenerDiasInhabiles } = useDias();

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const initialClienteId = cliente?._id || cliente?.id || '';

  const [formData, setFormData] = useState({
    fechaInicio: '',
    tipoServicio: '',
    costo: '',
    carro: '',
    informacionAdicional: '',
    estado: 'programada',
    cliente: initialClienteId
  });

  useEffect(() => {
    obtenerDiasInhabiles();
  }, []);

  // Keep cliente id in form when auth changes
  useEffect(() => {
    if (cliente?._id && formData.cliente !== cliente._id) {
      setFormData(prev => ({ ...prev, cliente: cliente._id }));
    }
  }, [cliente]);

  useEffect(() => {
    console.log('Form data (debug):', formData);
    console.log('Cliente (debug):', cliente);
  }, [formData, cliente]);

  const handleInputChange = (e) => {
    // allows both synthetic event and manual object with target
    const target = e?.target ? e.target : e;
    const { name, value } = target;

    // tipoServicio sets costo automatically
    if (name === 'tipoServicio') {
      setFormData(prev => ({ ...prev, tipoServicio: value, costo: costosPorServicio[value] || '' }));
      setErrors(prev => ({ ...prev, tipoServicio: '' }));
      return;
    }

    // fechaInicio: ensure storage in "YYYY-MM-DDTHH:MM" local format
    if (name === 'fechaInicio') {
      let inputValue = value;

      // If a Date object was provided, convert to input format
      if (value instanceof Date) {
        inputValue = toDateTimeLocalString(value);
      } else if (typeof value === 'string') {
        // If the string looks localized (slashes or contains AM/PM spanish), try parsing then normalize
        const looksLocalized = /[\/]|[ap]\.?m\.?/i.test(value);
        if (looksLocalized) {
          const parsed = new Date(value);
          if (!isNaN(parsed.getTime())) {
            inputValue = toDateTimeLocalString(parsed);
          }
        }
        // If it is ISO with seconds e.g. "2025-11-24T15:27:00.000Z" -> parse and normalize to local input format
        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          const parsed = new Date(value);
          if (!isNaN(parsed.getTime())) {
            // convert to local representation (no Z)
            inputValue = toDateTimeLocalString(parsed);
          }
        }
      }

      setFormData(prev => ({ ...prev, fechaInicio: inputValue }));
      // immediate validation feedback (reuse local checks)
      const dt = parseLocalDate(inputValue);
      if (!dt || isNaN(dt.getTime())) {
        setErrors(prev => ({ ...prev, fechaInicio: 'Formato de fecha inválido' }));
        return;
      }
      // dias inhábiles
      const selectedDay = dt.toDateString();
      const isDisabled = Array.isArray(diasInhabiles) && diasInhabiles.some(d => {
        const diaDate = parseLocalDate(d.fecha) || new Date(d.fecha);
        return diaDate.toDateString() === selectedDay;
      });
      if (isDisabled) {
        setErrors(prev => ({ ...prev, fechaInicio: 'La fecha seleccionada está marcada como inhábil' }));
        return;
      }
      // hora valida
      const totalMinutes = dt.getHours() * 60 + dt.getMinutes();
      const minMinutes = 9 * 60;
      const maxMinutes = 17 * 60;
      if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
        setErrors(prev => ({ ...prev, fechaInicio: 'Selecciona una hora entre 09:00 y 17:00' }));
        return;
      }
      setErrors(prev => ({ ...prev, fechaInicio: '' }));
      return;
    }

    // generic update
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Ensure we use the correct cliente id
    const clienteId = cliente?._id || cliente?.id || formData.cliente;

    // Use context validate if available and function, else fallback local
    const validator = typeof validateCitaData === 'function' ? validateCitaData : (data) => localValidateCitaData(data, diasInhabiles);

    const validationTarget = { ...formData, cliente: clienteId };

    // Normalize fechaInicio for validation: ensure parseable
    if (validationTarget.fechaInicio && typeof validationTarget.fechaInicio === 'string') {
      const parsed = parseLocalDate(validationTarget.fechaInicio);
      if (parsed) {
        // keep as input-format for validation helpers
        validationTarget.fechaInicio = toDateTimeLocalString(parsed);
      }
    }

    const validationResult = validator(validationTarget);

    console.log('Validation result (submit):', validationResult);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    // Prepare payload: convert fechaInicio to timestamp (ms) to avoid ISO/timezone ambiguity
    let payload = { ...formData, cliente: clienteId };
    if (payload.fechaInicio) {
      const parsed = parseLocalDate(payload.fechaInicio);
      if (!parsed || isNaN(parsed.getTime())) {
        setErrors({ fechaInicio: 'Formato de fecha inválido' });
        return;
      }
      // <-- send numeric timestamp (ms) instead of ISO string
      payload.fechaInicio = parsed.getTime();
    }
    
    try {
      setLoading(true);
      const result = await addCita(payload);
      if (result.success) {
        setShowSuccess(true);
        setFormData({
          fechaInicio: '',
          fechaFin: '',
          tipoServicio: '',
          costo: '',
          carro: '',
          informacionAdicional: '',
          estado: 'programada',
          cliente: clienteId
        });
        setTimeout(() => navigate('/misCitas'), 1200);
      } else {
        // map server errors to fields when possible
        const serverErr = result.error || {};
        if (serverErr.fechaInicio) setErrors({ fechaInicio: serverErr.fechaInicio });
        else setErrors({ submit: serverErr.server || serverErr.submit || serverErr.message || 'Error al crear la cita' });
      }
    } catch (err) {
      setErrors({ submit: err?.message || 'Error al crear la cita' });
    } finally {
      setLoading(false);
    }
  };

  // Validate datetime-local input: forbid días inhábiles and validar hora entre 09:00 - 17:00
  const handleFechaChange = (e) => {
    const value = e.target.value; // formato "YYYY-MM-DDTHH:MM"
    if (!value) {
      setTimeError('');
      handleInputChange(e);
      return;
    }

    // Normal behavior: pass raw value to hook; hook will normalize/validate and convert as needed.
    // But keep client-side immediate checks for UX (avoid duplicate complex parsing)
    try {
      const [datePart, timePart = '00:00'] = value.split('T'); // asegurar timePart
      const [y, m, d] = datePart.split('-').map(Number);
      const [hh, mm] = timePart.split(':').map(Number);
      const selectedDate = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
      if (isNaN(selectedDate.getTime())) {
        setTimeError('Fecha inválida');
        return;
      }

      const isDisabled = diasInhabiles.some(dia =>
        new Date(dia.fecha).toDateString() === selectedDate.toDateString()
      );
      if (isDisabled) {
        setTimeError('La fecha seleccionada está marcada como inhábil');
        return;
      }

      const totalMinutes = (hh || 0) * 60 + (mm || 0);
      const minMinutes = 9 * 60;   // 09:00
      const maxMinutes = 17 * 60;  // 17:00
      if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
        setTimeError('Selecciona una hora entre 09:00 y 17:00');
        return;
      }

      setTimeError('');
      // propagate the original event; hook will normalize (to ISO for submit) and persist input-format
      handleInputChange(e);
    } catch (err) {
      setTimeError('Error en la fecha');
      console.error('handleFechaChange error:', err);
    }
  };

  return {
    formData,
    loading,
    showSuccess,
    errors,
    handleInputChange,
    handleSubmit,
    setFormData
  };
};