// SERVICE
// El service tiene las reglas del negocio: lo que la aplicación decide y controla. Por ejemplo, "no puede haber dos cuentas con el mismo email".
// Debe tener: validaciones del negocio, cálculos y errores propios (AppError). Para leer o guardar datos usa los repositories.
// No debe tener: nada de req/res (lo propio del controller) ni consultas directas a la base de datos.
// Este archivo: tiene las reglas de las categorías de productos.

import * as categoriaRepository from '../repositories/categoria.repository.js';
import { traducirErrorPrisma } from '../utils/prismaErrors.js';
import { MESSAGES } from '../constants/messages.js';
import { PRISMA_ERRORS } from '../constants/prisma.js';

const traducirError = traducirErrorPrisma({
  [PRISMA_ERRORS.duplicate]: MESSAGES.categoria.duplicate,
  [PRISMA_ERRORS.notFound]: MESSAGES.categoria.notFound,
});

const listar = () => categoriaRepository.listar();

const crear = (datos) => categoriaRepository.crear(datos).catch(traducirError);

const editar = (id, datos) => categoriaRepository.actualizar(id, datos).catch(traducirError);

const eliminar = (id) => categoriaRepository.eliminar(id).catch(traducirError);

export { listar, crear, editar, eliminar };
