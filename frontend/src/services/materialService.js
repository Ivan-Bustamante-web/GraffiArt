import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/materiales`;

// Arma el header con el token del usuario logueado (hace falta para crear/editar/eliminar)
const authHeaders = () => {
  const token = localStorage.getItem('graffiart_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMateriales = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getMaterial = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const crearMaterial = async (data) => {
  const res = await axios.post(API_URL, data, { headers: authHeaders() });
  return res.data;
};

export const editarMaterial = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, { headers: authHeaders() });
  return res.data;
};

export const eliminarMaterial = async (id) => {
  await axios.delete(`${API_URL}/${id}`, { headers: authHeaders() });
};