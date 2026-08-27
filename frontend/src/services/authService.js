import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const register = async (datos) => {
  const res = await axios.post(`${API_URL}/register`, datos);
  return res.data;
};