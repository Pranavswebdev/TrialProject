import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const sendOtp = async (phone) => {
  const response = await api.post('/api/v1/auth/send-otp', { phone });
  return response.data;
};

export const verifyOtp = async (phone, otp) => {
  const response = await api.post('/api/v1/auth/verify-otp', { phone, otp });
  return response.data;
};

export default api;
