import axios from 'axios';

const API_URL = `${
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
}/categorias`;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('graffiart_token') || ''}`,
  },
});

export const getCategorias = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

export const crearCategoria = async (data) => {
  const response = await axios.post(API_URL, data, getConfig());
  return response.data;
};

export const editarCategoria = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getConfig());
  return response.data;
};

export const eliminarCategoria = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getConfig());
};
