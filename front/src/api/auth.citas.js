import axios from './axios';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
});

export const addCitaRequest = (cita) =>
  axios.post('/citas/agregarCita', cita, { headers: getAuthHeaders() });

// Get all appointments
export const getCitasRequest = () =>
  axios.get('/citas/verCitas', { headers: getAuthHeaders() });

// Get appointment by ID
export const getCitaRequest = (id) =>
  axios.get(`/citas/verCita/${id}`, { headers: getAuthHeaders() });

// Get appointments by client ID
export const getCitasByClienteRequest = (clienteId) =>
  axios.get(`/citas/porCliente/${clienteId}`, { headers: getAuthHeaders() });

// Get appointments by car ID
export const getCitasByCarroRequest = (carroId) =>
  axios.get(`/citas/porCarro/${carroId}`, { headers: getAuthHeaders() });

// Update appointment
export const updateCitaRequest = (id, cita) =>
  axios.put(`/citas/actualizarCita/${id}`, cita, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
  });

// Delete appointment
export const deleteCitaRequest = (id) =>
  axios.delete(`/citas/eliminarCita/${id}`, { headers: getAuthHeaders() });

export const getAllCitasRequest = () =>
  axios.get('/citas/getAllCitas', { headers: getAuthHeaders() });
export const updateCitaEstadoRequest = (id, estado) =>
  axios.put(`/citas/updateEstado/${id}`, { estado }, { headers: getAuthHeaders() });

export const cancelCitaRequest = (id) => {axios.post(`/citas/${id}/cancel`);};