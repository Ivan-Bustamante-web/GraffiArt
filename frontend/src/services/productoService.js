import axios from 'axios';

const API_URL = `${
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
}/productos`;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('graffiart_token') || ''}`,
  },
});

export const getProductos = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

export const getProducto = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getConfig());
  return response.data;
};

export const crearProducto = async (producto) => {
  const response = await axios.post(API_URL, producto, getConfig());
  return response.data;
};

export const editarProducto = async (id, producto) => {
  const response = await axios.put(`${API_URL}/${id}`, producto, getConfig());
  return response.data;
};

export const eliminarProducto = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getConfig());
};
