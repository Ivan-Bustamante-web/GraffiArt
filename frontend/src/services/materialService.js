import axios from 'axios';

const API_URL = 'http://localhost:3000/api/materiales';

export const getMateriales = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getMaterial = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const crearMaterial = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const editarMaterial = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const eliminarMaterial = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};