import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    addCitaRequest, 
    getCitasRequest, 
    getCitaRequest,
    getCitasByClienteRequest,
    getCitasByCarroRequest,
    updateCitaRequest,
    deleteCitaRequest,
    getAllCitasRequest,
    updateCitaEstadoRequest
} from '../api/auth.citas';

export const CitasContext = createContext();

export const useCitas = () => {
    const context = useContext(CitasContext);
    if (!context) {
        throw new Error('useCitas must be used within a CitasProvider');
    }
    return context;
};

export const CitasProvider = ({ children }) => {
    const [citas, setCitas] = useState([]);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);

    // Agregar una nueva cita
    const addCita = async (citaData) => {
        try {
            setLoading(true);
            const res = await addCitaRequest(citaData);
            setCitas(prev => [...prev, res.data]);
            return { success: true, data: res.data };
        } catch (error) {
            console.error('Error al agregar cita:', error);
            setError(error.response?.data?.message || 'Error al crear la cita');
            return { success: false, error: error.response?.data };
        } finally {
            setLoading(false);
        }
    };

    // Obtener todas las citas
    const getCitas = async () => {
        try {
            setLoading(true);
            const res = await getCitasRequest();
            setCitas(res.data);
            return res.data;
        } catch (error) {
            console.error('Error al obtener citas:', error);
            setError(error.response?.data?.message || 'Error al obtener las citas');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Obtener cita por ID
    const getCitaById = useCallback(async (id) => {
        try {
            setLoading(true);
            const res = await getCitaRequest(id);
            return res.data;
        } catch (error) {
            console.error('Error al obtener cita:', error);
            setError(error.response?.data?.message || 'Error al obtener la cita');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener citas por cliente
    const getCitasByCliente = useCallback(async (clienteId) => {
        try {
            setLoading(true);
            const res = await getCitasByClienteRequest(clienteId);
            console.log('Citas del cliente obtenidas:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error al obtener citas del cliente:', error);
            setError(error.response?.data?.message || 'Error al obtener las citas del cliente');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener citas por carro
    const getCitasByCarro = useCallback(async (carroId) => {
        try {
            setLoading(true);
            const res = await getCitasByCarroRequest(carroId);
            return res.data;
        } catch (error) {
            console.error('Error al obtener citas del vehículo:', error);
            setError(error.response?.data?.message || 'Error al obtener las citas del vehículo');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Actualizar cita
    const updateCita = async (id, citaData) => {
        try {
            setLoading(true);
            const res = await updateCitaRequest(id, citaData);
            setCitas(prev => prev.map(cita => 
                cita._id === id ? res.data : cita
            ));
            return { success: true, data: res.data };
        } catch (error) {
            console.error('Error al actualizar cita:', error);
            setError(error.response?.data?.message || 'Error al actualizar la cita');
            return { success: false, error: error.response?.data };
        } finally {
            setLoading(false);
        }
    };

    // Eliminar cita
    const deleteCita = async (id) => {
        try {
            setLoading(true);
            await deleteCitaRequest(id);
            setCitas(prev => prev.filter(cita => cita._id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error al eliminar cita:', error);
            setError(error.response?.data?.message || 'Error al eliminar la cita');
            return { success: false, error: error.response?.data };
        } finally {
            setLoading(false);
        }
    };

    // Obtener todas las citas (sin filtros)
    const getAllCitas = async () => {
        try {
            const response = await getAllCitasRequest();
            return response.data;
        } catch (error) {
            console.error('Error al obtener citas:', error);
            throw error;
        }
    };

    // Actualizar estado de una cita
    const updateCitaEstado = async (citaId, nuevoEstado) => {
        try {
            console.log('Context recibió:', { citaId, nuevoEstado });
            const result = await updateCitaEstadoRequest(citaId, nuevoEstado);
            console.log('Respuesta del servidor:', result.data);
            return result.data;
        } catch (error) {
            console.error(' Error en updateCitaEstado:', error.response?.data || error.message);
            throw error;
        }
    };

    // Validar datos de la cita
    const validateCitaData = (citaData) => {
        const errors = {};
        
        if (!citaData.fechaInicio) {
            errors.fechaInicio = 'La fecha de inicio es requerida';
        }
        
        if (!citaData.fechaFin) {
            errors.fechaFin = 'La fecha de fin es requerida';
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

        // Validar que las fechas sean válidas
        if (citaData.fechaInicio && citaData.fechaFin) {
            const inicio = new Date(citaData.fechaInicio);
            const fin = new Date(citaData.fechaFin);
            
            if (isNaN(inicio.getTime())) {
              errors.fechaInicio = 'Fecha de inicio inválida';
            }
            
            if (isNaN(fin.getTime())) {
              errors.fechaFin = 'Fecha de fin inválida';
            }
            
            if (fin <= inicio) {
              errors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    // Limpiar errores después de 5 segundos
    useEffect(() => {
        if (error.length > 0) {
            const timer = setTimeout(() => {
                setError([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <CitasContext.Provider value={{
            citas,
            loading,
            error,
            addCita,
            getCitas,
            getCitaById,
            getCitasByCliente,
            getCitasByCarro,
            updateCita,
            deleteCita,
            getAllCitas,
            updateCitaEstado,
            validateCitaData
        }}>
            {children}
        </CitasContext.Provider>
    );
};