import axios from './axios';

export const registerRequest = cliente => axios.post(`/register`, cliente);

export const loginRequest = admin => axios.post(`/login`, admin);

export const verifyTokenRequest = () => axios.get(`/verify`);