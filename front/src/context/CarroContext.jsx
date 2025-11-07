import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    addCarroRequest, 
    getCarrosRequest, 
    getCarroRequest, 
    updateCarroRequest, 
    deleteCarroRequest 
} from '../api/auth.carro';

const CarroContext = createContext();

export const useCarro = () => {
    const context = useContext(CarroContext);
    if (!context) {
        throw new Error('useCarro must be used within a CarroProvider');
    }
    return context;
};

export const CarroProvider = ({ children }) => {
    const [carros, setCarros] = useState([]);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);

    // Validar datos del carro antes de enviar
    const validateCarroData = (data) => {
        const errors = {};
        
        if (!data.marca?.trim()) errors.marca = 'La marca es requerida';
        if (!data.modelo?.trim()) errors.modelo = 'El modelo es requerido';
        if (!data.año) errors.año = 'El año es requerido';
        if (!data.placas?.trim()) errors.placas = 'Las placas son requeridas';
        if (!data.color?.trim()) errors.color = 'El color es requerido';
        if (!data.tipo?.trim()) errors.tipo = 'El tipo de vehículo es requerido';
        if (!data.propietario) errors.submit = 'Error de sesión: propietario no identificado';

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    // Agregar un nuevo carro
    const addCarro = async (carroData) => {
        try {
            const res = await addCarroRequest(carroData);
            if (res.data) {
                setCarros(prev => [...prev, res.data]);
                return { success: true, data: res.data };
            }
            throw new Error('No se recibieron datos del servidor');
        } catch (error) {
            console.error('Error al agregar carro:', error);
            return {
                success: false,
                error: {
                    message: error.response?.data?.message || 'Error al registrar el vehículo'
                }
            };
        }
    };

    // Obtener todos los carros
    const getCarros = async () => {
        try {
            setLoading(true);
            const res = await getCarrosRequest();
            setCarros(res.data);
            setLoading(false);
            return res.data;
        } catch (error) {
            console.error('Error al obtener carros:', error);
            setError([error.response ? error.response.data : 'Error al obtener los vehículos']);
            setLoading(false);
            throw error;
        }
    };

    // Obtener un carro por ID
    const getCarroById = useCallback(async (id) => {
        try {
            const res = await getCarroRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error al obtener el vehículo:", error);
            throw error;
        }
    }, []);

    // Obtener carros por propietario (cliente)
    const getCarrosByPropietario = useCallback(async (propietarioId) => {
        try {
            setLoading(true);
            const res = await getCarrosRequest();
            const carrosFiltrados = res.data.filter(carro => carro.propietario === propietarioId);
            setLoading(false);
            return carrosFiltrados;
        } catch (error) {
            console.error("Error al obtener vehículos del propietario:", error);
            setError([error.response ? error.response.data : 'Error al obtener los vehículos']);
            setLoading(false);
            throw error;
        }
    }, []);

    // Actualizar un carro
    const updateCarro = async (carroData) => {
        try {
            setLoading(true);
            const res = await updateCarroRequest(carroData);
            setCarros(prev => prev.map(carro => 
                carro._id === carroData._id ? res.data : carro
            ));
            setLoading(false);
            return { success: true, data: res.data };
        } catch (error) {
            console.error('Error al actualizar carro:', error);
            setError([error.response ? error.response.data : 'Error al actualizar el vehículo']);
            setLoading(false);
            return { success: false, error: error.response?.data };
        }
    };

    // Eliminar uno o varios carros
    const deleteCarros = async (ids) => {
        try {
            setLoading(true);
            if (Array.isArray(ids)) {
                const results = await Promise.all(
                    ids.map(id => deleteCarroRequest(id))
                );
                setCarros(prev => prev.filter(carro => !ids.includes(carro._id)));
                setLoading(false);
                return results.map(res => res.data);
            } else {
                const res = await deleteCarroRequest(ids);
                setCarros(prev => prev.filter(carro => carro._id !== ids));
                setLoading(false);
                return res.data;
            }
        } catch (error) {
            console.error('Error al eliminar carro:', error);
            setError([error.response ? error.response.data : 'Error al eliminar el vehículo']);
            setLoading(false);
            throw error;
        }
    };

    // Limpiar errores después de un tiempo
    useEffect(() => {
        if (error.length > 0) {
            const timer = setTimeout(() => {
                setError([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <CarroContext.Provider value={{
            carros,
            setCarros,
            addCarro,
            getCarros,
            getCarroById,
            getCarrosByPropietario,
            updateCarro,
            deleteCarros,
            validateCarroData,
            error,
            setError,
            loading
        }}>
            {children}
        </CarroContext.Provider>
    );
};