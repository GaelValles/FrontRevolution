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

    // Agregar un nuevo carro
    const addCarro = async (carroData) => {
        try {
            setLoading(true);
            const res = await addCarroRequest(carroData);
            setCarros(prev => [...prev, res.data]);
            setLoading(false);
            return { success: true, data: res.data };
        } catch (error) {
            console.error('Error al agregar carro:', error.response?.data);
            setError([error.response ? error.response.data : 'Error al agregar el vehículo']);
            setLoading(false);
            return { success: false, error: error.response?.data };
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

    // Validar datos del carro antes de enviar
    const validateCarroData = (carroData) => {
        const errors = {};
        
        if (!carroData.marca || carroData.marca.trim() === '') {
            errors.marca = 'La marca es requerida';
        }
        
        if (!carroData.modelo || carroData.modelo.trim() === '') {
            errors.modelo = 'El modelo es requerido';
        }
        
        if (!carroData.año || carroData.año < 1900 || carroData.año > new Date().getFullYear() + 1) {
            errors.año = 'El año debe estar entre 1900 y ' + (new Date().getFullYear() + 1);
        }
        
        if (!carroData.placas || carroData.placas.length !== 3) {
            errors.placas = 'La terminación de las placas debe tener exactamente 3 caracteres';
        }
        
        if (!carroData.color || carroData.color.trim() === '') {
            errors.color = 'El color es requerido';
        }
        
        const tiposValidos = [
            'carro chico',
            'carro grande',
            'camioneta chica',
            'camioneta grande',
            'motocicleta chica',
            'motocicleta grande'
        ];
        
        if (!carroData.tipo || !tiposValidos.includes(carroData.tipo)) {
            errors.tipo = 'Debe seleccionar un tipo de vehículo válido';
        }
        
        if (!carroData.propietario) {
            errors.propietario = 'El propietario es requerido';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
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