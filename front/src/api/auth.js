import axios from './axios';

export const registerRequest = admin => axios.post(`/signup`, admin);

export const loginRequest = admin => axios.post(`/login`, admin);

export const verifyTokenRequest = () => axios.get(`/verify`);