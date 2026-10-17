// UTILIDAD
// Traduce errores de la base de datos (duplicado, no encontrado) a mensajes claros para el usuario.

import AppError from './AppError.js';
import { PRISMA_ERROR_STATUS } from '../constants/prisma.js';

const traducirErrorPrisma = (mensajes) => (error) => {
  const mensaje = mensajes[error.code];
  if (!mensaje) throw error;
  throw new AppError(PRISMA_ERROR_STATUS[error.code], mensaje);
};

export { traducirErrorPrisma };
