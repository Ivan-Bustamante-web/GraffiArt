import apiClient from "../api/apiClient";

export async function loginUser(credentials) {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
}

export async function registerUser(userData) {
  const { data } = await apiClient.post("/auth/register", userData);
  return data;
}

export async function requestPasswordReset(email) {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(payload) {
  const { data } = await apiClient.post("/auth/reset-password", payload);
  return data;
}

const authService = {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
};

export default authService;