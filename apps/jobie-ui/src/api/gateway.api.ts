import axios from 'axios';

export const gatewayApi = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
});
