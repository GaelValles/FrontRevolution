import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCitas } from '../context/CitasContext';
import { validateDates } from '../utils/dateUtils';
import { costosPorServicio } from '../constants/servicios';

export const useCitaForm = (navigate) => {
  const { cliente } = useAuth();
  const { addCita } = useCitas();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipoServicio: '',
    costo: '',
    carro: '',
    informacionAdicional: '',
    estado: 'programada'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tipoServicio') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        costo: costosPorServicio[value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const cachedData = localStorage.getItem('userData');
    const userData = cachedData ? JSON.parse(cachedData) : null;
    const clienteId = cliente?._id || userData?.id;

    if (!clienteId) {
      setErrors({ 
        submit: 'Error de conexión. Por favor, actualice la página.' 
      });
      return;
    }

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.carro || !formData.tipoServicio || !formData.fechaInicio || !formData.fechaFin) {
        setErrors({
          submit: 'Por favor complete todos los campos requeridos'
        });
        return;
      }

      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);

      // Validate dates
      const dateValidation = validateDates(fechaInicio, fechaFin);
      if (!dateValidation.isValid) {
        setErrors({
          fechaFin: dateValidation.error
        });
        return;
      }

      const citaData = {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        tipoServicio: formData.tipoServicio,
        costo: Number(costosPorServicio[formData.tipoServicio]),
        carro: formData.carro,
        cliente: clienteId,
        informacionAdicional: formData.informacionAdicional || '',
        estado: 'programada'
      };

      console.log('Datos a enviar:', citaData);
      const result = await addCita(citaData);
      
      if (result.success) {
        setShowSuccess(true);
        // Reset form
        setFormData({
          fechaInicio: '',
          fechaFin: '',
          tipoServicio: '',
          costo: '',
          carro: '',
          informacionAdicional: '',
          estado: 'programada'
        });
        
        setTimeout(() => {
          navigate('/misCitas');
        }, 2000);
      } else {
        throw new Error(result.error?.message || 'Error al programar la cita');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrors({ 
        submit: error.response?.data?.message || error.message || 'Error al programar la cita'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    showSuccess,
    errors,
    handleInputChange,
    handleSubmit
  };
};