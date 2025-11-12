import axios from './axios';

export const getDiasInhabilesRequest = () => axios.get('/dias/obtenerDias');

export const addDiaInhabilRequest = (fecha) => axios.post('/dias/registrarDia', { fecha });

export const deleteDiaInhabilRequest = (id) => axios.delete(`/dias/eliminarDia/${id}`);