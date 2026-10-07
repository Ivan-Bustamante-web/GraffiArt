import axios from 'axios';

const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  return 'http://localhost:3000/api';
};

const usuarioApi = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

export function buildAuthHeaders() {
  const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
  const token = storage?.getItem?.('token') || storage?.getItem?.('graffiart_token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function getPerfil() {
  const { data } = await usuarioApi.get('/usuarios/perfil', {
    headers: buildAuthHeaders(),
  });

  return data;
}

export async function updatePerfil(payload) {
  const { data } = await usuarioApi.put('/usuarios/perfil', payload, {
    headers: buildAuthHeaders(),
  });

  return data;
}
