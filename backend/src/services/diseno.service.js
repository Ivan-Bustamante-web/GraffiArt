// SERVICE
// El service tiene las reglas del negocio: lo que la aplicación decide y controla. Por ejemplo, "no puede haber dos cuentas con el mismo email".
// Debe tener: validaciones del negocio, cálculos y errores propios (AppError). Para leer o guardar datos usa los repositories.
// No debe tener: nada de req/res (lo propio del controller) ni consultas directas a la base de datos.
// Este archivo: tiene las reglas de los diseños guardados de cada usuario.

import * as disenoRepository from '../repositories/diseno.repository.js';
import AppError from '../utils/AppError.js';
import { MESSAGES } from '../constants/messages.js';

const buscarDelUsuario = async (id, usuarioId) => {
  const diseno = await disenoRepository.buscarDelUsuario(id, usuarioId);
  if (!diseno) throw AppError.notFound(MESSAGES.diseno.notFound);
  return diseno;
};

const listar = (usuarioId) => disenoRepository.listarPorUsuario(usuarioId);

const crear = (usuarioId, datos) => disenoRepository.crear({ ...datos, usuarioId });

const actualizar = async (id, usuarioId, datos) => {
  await buscarDelUsuario(id, usuarioId);
  return disenoRepository.actualizar(id, datos);
};

const eliminar = async (id, usuarioId) => {
  await buscarDelUsuario(id, usuarioId);
  await disenoRepository.eliminar(id);
};

export { listar, crear, actualizar, eliminar };
