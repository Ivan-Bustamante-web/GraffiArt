import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

export async function registerUser(data) {
  const { data: response } = await authApi.post("/auth/register", data);
  return response;
}

export async function loginUser(data) {
  const { data: response } = await authApi.post("/auth/login", data);
  return response;
}

export async function requestPasswordReset(email) {
  const { data: response } = await authApi.post("/auth/forgot-password", { email });
  return response;
}

export async function resetPassword(data) {
  const { data: response } = await authApi.post("/auth/reset-password", data);
  return response;
}

export async function verifyEmail(token) {
  const { data: response } = await authApi.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  return response;
}
