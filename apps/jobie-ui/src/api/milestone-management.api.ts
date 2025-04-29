import axios from 'axios';

export const milestoneMangementApi = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_SERVER_URL}/milestone-management`,
});
