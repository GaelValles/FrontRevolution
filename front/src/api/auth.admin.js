import axios from './axios';

// Admin authentication
export const loginAdminRequest = admin => axios.post(`/login`, admin);
export const verifyTokenRequest = () => axios.get('/verify');

// Admin CRUD operations
export const getAdminsRequest = () => axios.get('/verUsuarios');
export const getAdminRequest = (id) => axios.get(`/verUsuario/${id}`);
export const addAdminRequest = (admin) => axios.post('/addUser', admin);
export const updateAdminRequest = (admin) => axios.put(`/actualizarUsuario/${admin._id}`, admin);
export const deleteAdminRequest = (id) => axios.delete(`/deleteUser/${id}`);