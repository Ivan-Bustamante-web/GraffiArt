import { create } from "zustand";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("graffiart_usuario") || "null");
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  usuario: readStoredUser(),
  token: localStorage.getItem("graffiart_token") || null,
  login: (usuario, token) => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.setItem("graffiart_token", token);
    localStorage.setItem("graffiart_usuario", JSON.stringify(usuario));
    set({ usuario, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("graffiart_token");
    localStorage.removeItem("graffiart_usuario");
    set({ usuario: null, token: null });
  },
}));
