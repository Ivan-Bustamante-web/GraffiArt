// SERVICE
// El service tiene las reglas del negocio: lo que la aplicación decide y controla. Por ejemplo, "no puede haber dos cuentas con el mismo email".
// Debe tener: validaciones del negocio, cálculos y errores propios (AppError). Para leer o guardar datos usa los repositories.
// No debe tener: nada de req/res (lo propio del controller) ni consultas directas a la base de datos.
// Este archivo: tiene las reglas de los productos (gabinetes) que gestiona el administrador.

import * as categoriaRepository from '../repositories/categoria.repository.js';
import * as gabineteRepository from '../repositories/gabinete.repository.js';
import AppError from '../utils/AppError.js';
import { traducirErrorPrisma } from '../utils/prismaErrors.js';
import { serializarGabinete } from '../utils/serializers.js';
import { MESSAGES } from '../constants/messages.js';
import { PRISMA_ERRORS } from '../constants/prisma.js';

const traducirError = traducirErrorPrisma({
  [PRISMA_ERRORS.notFound]: MESSAGES.producto.notFound,
});

const verificarCategoria = async (categoriaId) => {
  if (!categoriaId) return;
  const categoria = await categoriaRepository.buscarPorId(categoriaId);
  if (!categoria) throw AppError.badRequest(MESSAGES.producto.categoryMissing);
};

const listar = async () => {
  const productos = await gabineteRepository.listarConCategoria();
  return productos.map(serializarGabinete);
};

const obtener = async (id) => {
  const producto = await gabineteRepository.buscarConCategoria(id);
  if (!producto) throw AppError.notFound(MESSAGES.producto.notFound);
  return serializarGabinete(producto);
};

const crear = async (datos) => {
  await verificarCategoria(datos.categoriaId);
  return serializarGabinete(await gabineteRepository.crear(datos));
};

const editar = async (id, datos) => {
  await verificarCategoria(datos.categoriaId);
  const producto = await gabineteRepository.actualizar(id, datos).catch(traducirError);
  return serializarGabinete(producto);
};

const eliminar = (id) => gabineteRepository.eliminar(id).catch(traducirError);

export { listar, obtener, crear, editar, eliminar };
