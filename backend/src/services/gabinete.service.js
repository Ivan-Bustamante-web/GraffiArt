// SERVICE
// El service tiene las reglas del negocio: lo que la aplicación decide y controla. Por ejemplo, "no puede haber dos cuentas con el mismo email".
// Debe tener: validaciones del negocio, cálculos y errores propios (AppError). Para leer o guardar datos usa los repositories.
// No debe tener: nada de req/res (lo propio del controller) ni consultas directas a la base de datos.
// Este archivo: tiene las reglas del catálogo público de gabinetes.

import * as gabineteRepository from '../repositories/gabinete.repository.js';
import AppError from '../utils/AppError.js';
import { serializarGabinete } from '../utils/serializers.js';
import { MESSAGES } from '../constants/messages.js';

const listarActivos = async () => {
  const gabinetes = await gabineteRepository.listarActivos();
  return gabinetes.map(serializarGabinete);
};

const obtenerActivo = async (id) => {
  const gabinete = await gabineteRepository.buscarPorId(id);
  if (!gabinete?.activo) throw AppError.notFound(MESSAGES.gabinete.notFound);
  return serializarGabinete(gabinete);
};

export { listarActivos, obtenerActivo };
