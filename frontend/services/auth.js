import api from './api';

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function register(email, password) {
  return api.post('/auth/register', { email, password }).then(res => res.data);
}