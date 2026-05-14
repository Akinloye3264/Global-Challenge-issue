import axios from 'axios';
import type { PredictionInput, PredictionResult } from '../types';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('afya_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function signUp(name: string, email: string, password: string, organization?: string) {
  const res = await api.post('/auth/signup', { name, email, password, organization });
  return res.data;
}

export async function signIn(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function verifyEmailToken(token: string) {
  const res = await api.get(`/auth/verify/${token}`);
  return res.data;
}

export async function getPrediction(input: PredictionInput): Promise<{ prediction: PredictionResult }> {
  const res = await api.post('/predictions', input);
  return res.data;
}

export default api;
