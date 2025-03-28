import axios from 'axios';

export const authApi = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
});
