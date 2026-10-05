import axios from 'axios';

const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  return 'http://localhost:3000/api';
};

const disenoApi = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

export function buildAuthHeaders() {
  const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
  const token = storage?.getItem?.('token') || storage?.getItem?.('graffiart_token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

export async function listarDisenos() {
  const { data } = await disenoApi.get('/disenos', { headers: buildAuthHeaders() });
  return data;
}

export async function crearDiseno(payload) {
  const { data } = await disenoApi.post('/disenos', payload, { headers: buildAuthHeaders() });
  return data;
}

export async function actualizarDiseno(id, payload) {
  const { data } = await disenoApi.put(`/disenos/${id}`, payload, { headers: buildAuthHeaders() });
  return data;
}

export async function eliminarDiseno(id) {
  await disenoApi.delete(`/disenos/${id}`, { headers: buildAuthHeaders() });
}
