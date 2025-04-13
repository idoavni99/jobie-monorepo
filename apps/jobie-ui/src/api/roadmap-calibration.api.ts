import axios from 'axios';

export const roadmapCalibrationApi = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_SERVER_URL}/roadmap-calibration`,
});
