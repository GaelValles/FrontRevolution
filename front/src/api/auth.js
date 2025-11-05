import axios from './axios';

// Cliente authentication
export const registerRequest = cliente => axios.post('/register', cliente);
export const loginRequest = cliente => axios.post('/login', cliente);
export const verifyTokenRequest = () => axios.get('/verify');