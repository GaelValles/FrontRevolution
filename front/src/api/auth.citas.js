import axios from './axios';

export const addCitaRequest = (cita) => axios.post(`/citas/agregarCita`, cita);

// Get all appointments
export const getCitasRequest = () => axios.get(`/citas/verCitas`);

// Get appointment by ID
export const getCitaRequest = (id) => 
    axios.get(`${API}/citas/verCita/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

// Get appointments by client ID
export const getCitasByClienteRequest = (clienteId) => axios.get(`/citas/porCliente/${clienteId}`);

// Get appointments by car ID
export const getCitasByCarroRequest = (carroId) => 
    axios.get(`${API}/citas/porCarro/${carroId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

// Update appointment
export const updateCitaRequest = (id, cita) => 
    axios.put(`${API}/citas/actualizarCita/${id}`, cita, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

// Delete appointment
export const deleteCitaRequest = (id) => 
    axios.delete(`${API}/citas/eliminarCita/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });