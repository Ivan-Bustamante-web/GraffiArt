// CONSTANTES
// Aquí viven los valores fijos del proyecto (textos, números, listas) en un solo lugar, para no repetirlos ni escribirlos a mano en otros archivos.
// Debe tener: solo datos. Se importan donde hacen falta.
// No debe tener: lógica ni funciones complejas.
// Este archivo: guarda valores de configuración del servidor: entornos, puerto, duración de la sesión.

export const ENVIRONMENTS = {
  development: 'development',
  production: 'production',
};
export const NODE_ENVS = Object.values(ENVIRONMENTS);
export const DEFAULT_NODE_ENV = ENVIRONMENTS.development;
export const DEFAULT_PORT = 3000;
export const DEFAULT_JWT_EXPIRES_IN = '8h';
export const DEFAULT_FRONTEND_URL = 'http://localhost:5173';
export const MIN_JWT_SECRET_LENGTH = 16;
export const API_PREFIX = '/api';
