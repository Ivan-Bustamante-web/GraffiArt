// SERVICE
// El service tiene las reglas del negocio: lo que la aplicación decide y controla. Por ejemplo, "no puede haber dos cuentas con el mismo email".
// Debe tener: validaciones del negocio, cálculos y errores propios (AppError). Para leer o guardar datos usa los repositories.
// No debe tener: nada de req/res (lo propio del controller) ni consultas directas a la base de datos.
// Este archivo: tiene las reglas de los materiales del inventario.

import * as materialRepository from '../repositories/material.repository.js';
import AppError from '../utils/AppError.js';
import { traducirErrorPrisma } from '../utils/prismaErrors.js';
import { serializarMaterial } from '../utils/serializers.js';
import { MESSAGES } from '../constants/messages.js';
import { PRISMA_ERRORS } from '../constants/prisma.js';

const traducirError = traducirErrorPrisma({
  [PRISMA_ERRORS.duplicate]: MESSAGES.material.duplicate,
  [PRISMA_ERRORS.notFound]: MESSAGES.material.notFound,
});

const listar = async () => {
  const materiales = await materialRepository.listar();
  return materiales.map(serializarMaterial);
};

const obtener = async (id) => {
  const material = await materialRepository.buscarPorId(id);
  if (!material) throw AppError.notFound(MESSAGES.material.notFound);
  return serializarMaterial(material);
};

const crear = async (datos) =>
  serializarMaterial(await materialRepository.crear(datos).catch(traducirError));

const editar = async (id, datos) =>
  serializarMaterial(await materialRepository.actualizar(id, datos).catch(traducirError));

const eliminar = (id) => materialRepository.eliminar(id).catch(traducirError);

export { listar, obtener, crear, editar, eliminar };
