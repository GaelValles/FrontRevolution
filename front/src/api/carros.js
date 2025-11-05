import axios from 'axios';

const API = 'http://localhost:4000/api';

// Add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getCarrosRequest = () => axios.get(`${API}/carros/verCarros`);

export const getCarroPorPropietarioRequest = (id) => 
  axios.get(`${API}/carros/porPropietario/${id}`);

export const agregarCarroRequest = (carro) => 
  axios.post(`${API}/carros/agregarCarro`, carro);

export const actualizarCarroRequest = (id, carro) => 
  axios.put(`${API}/carros/actualizarCarro/${id}`, carro);

export const eliminarCarroRequest = (id) => 
  axios.delete(`${API}/carros/eliminarCarro/${id}`);