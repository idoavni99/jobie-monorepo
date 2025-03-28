import axios from 'axios';

export const profileEnrichmentApi = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_SERVER_URL}/user-profile-enrichment`,
});
