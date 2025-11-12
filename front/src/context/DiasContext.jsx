import { createContext, useContext, useState } from 'react';
import { 
  getDiasInhabilesRequest, 
  addDiaInhabilRequest, 
  deleteDiaInhabilRequest 
} from '../api/auth.dias';

const DiasContext = createContext();

export const useDias = () => {
  const context = useContext(DiasContext);
  if (!context) {
    throw new Error('useDias debe usarse dentro de DiasProvider');
  }
  return context;
};

export const DiasProvider = ({ children }) => {
  const [diasInhabiles, setDiasInhabiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  // Obtener todos los días inhábiles
  const obtenerDiasInhabiles = async () => {
    try {
      setLoading(true);
      const response = await getDiasInhabilesRequest();
      setDiasInhabiles(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener días inhábiles:', error);
      setErrors(error.response?.data?.message || 'Error al obtener días inhábiles');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Registrar un nuevo día inhábil
  const registrarDiaInhabil = async (fecha) => {
    try {
      // Asegurar que la fecha está en UTC
      const fechaUTC = new Date(fecha);
      fechaUTC.setHours(12, 0, 0, 0);
      
      const response = await addDiaInhabilRequest(fechaUTC.toISOString());
      setDiasInhabiles(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error al registrar día inhábil:', error);
      throw error.response?.data || error;
    }
  };

  // Registrar múltiples días inhábiles
  const registrarDiasInhabiles = async (dias) => {
    try {
      const results = [];
      for (const dia of dias) {
        const diaRegistrado = await registrarDiaInhabil(dia.fecha);
        results.push(diaRegistrado);
      }
      return results;
    } catch (error) {
      console.error('Error al registrar días inhábiles:', error);
      throw error;
    }
  };

  // Eliminar un día inhábil
  const eliminarDiaInhabil = async (id) => {
    try {
      await deleteDiaInhabilRequest(id);
      
      // Actualizar el estado local eliminando el día inhábil
      setDiasInhabiles(prev => prev.filter(dia => dia._id !== id));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar día inhábil:', error);
      throw error.response?.data || error;
    }
  };

  // Verificar si una fecha es inhábil
  const esFechaInhabil = (fecha) => {
    const fechaAVerificar = new Date(fecha).toDateString();
    return diasInhabiles.some(dia => 
      new Date(dia.fecha).toDateString() === fechaAVerificar
    );
  };

  return (
    <DiasContext.Provider value={{
      diasInhabiles,
      loading,
      errors,
      obtenerDiasInhabiles,
      registrarDiaInhabil,
      registrarDiasInhabiles,
      eliminarDiaInhabil,
      esFechaInhabil
    }}>
      {children}
    </DiasContext.Provider>
  );
};