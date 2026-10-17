import apiClient from "../api/axios";

export const listarGabinetes = async () => {
  const { data } = await apiClient.get("/gabinetes");
  return data;
};

export const obtenerGabinete = async (id) => {
  const { data } = await apiClient.get(`/gabinetes/${id}`);
  return data;
};
