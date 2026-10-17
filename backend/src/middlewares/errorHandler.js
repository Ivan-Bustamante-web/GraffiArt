// MIDDLEWARE
// Atrapa todos los errores de la API y los convierte en una respuesta ordenada con el formato { error: "mensaje" }.
// También responde cuando la ruta no existe.

import { Prisma } from '@prisma/client';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import { PRISMA_ERRORS, PRISMA_ERROR_STATUS } from '../constants/prisma.js';
import { MESSAGES } from '../constants/messages.js';

const notFound = (req, res) => {
  res.status(404).json({ error: MESSAGES.http.routeNotFound });
};

const traducirErrorPrisma = (error) => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;

  const mensajes = {
    [PRISMA_ERRORS.duplicate]: MESSAGES.prisma.duplicate,
    [PRISMA_ERRORS.related]: MESSAGES.prisma.related,
    [PRISMA_ERRORS.notFound]: MESSAGES.prisma.notFound,
  };
  const mensaje = mensajes[error.code];
  return mensaje ? new AppError(PRISMA_ERROR_STATUS[error.code], mensaje) : null;
};

const errorHandler = (error, req, res, next) => {
  const appError = error instanceof AppError ? error : traducirErrorPrisma(error);

  if (appError) {
    return res.status(appError.statusCode).json({ error: appError.message });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: MESSAGES.http.invalidJson });
  }

  console.error(error);
  res.status(500).json({
    error: env.isProduction ? MESSAGES.http.internal : error.message,
  });
};

export { notFound, errorHandler };
