import axios from './axios';

// Carros endpoints
export const addCarroRequest = (carro) => axios.post('/carros/agregarCarro', carro);
export const deleteCarroRequest = (id) => axios.delete(`/carros/eliminarCarro/${id}`);
export const updateCarroRequest = (carro) => axios.put(`/carros/actualizarCarro/${carro._id}`, carro);
export const getCarrosRequest = () => axios.get('/carros/verCarros');
export const getCarroPorPropietarioRequest = (id) => axios.get(`/carros/porPropietario/${id}`);
export const getCarroRequest = (id) => axios.get(`/carros/verCarro/${id}`);