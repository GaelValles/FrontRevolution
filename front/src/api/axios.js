import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
    headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 20000
})

export default instance;