import apiClient from "../api/axios";

export const loginUser = async (credentials) => {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await apiClient.post("/auth/register", userData);
  return data;
};

const authService = {
  loginUser,
  registerUser,
};

export default authService;