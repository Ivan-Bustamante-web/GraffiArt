// REPOSITORY
// El repository es el único que habla con la base de datos. Cada función es una consulta simple: buscar, listar, crear, actualizar o borrar.
// Debe tener: consultas de Prisma y nada más; devuelve los datos tal cual vienen.
// No debe tener: reglas del negocio ni mensajes de error para el usuario (eso es del service).
// Este archivo: hace las consultas a la base de datos de las categorías de productos.

import prisma from '../lib/prisma.js';
import { CATEGORIA_CON_CONTEO } from '../constants/prisma.js';

const listar = () =>
  prisma.categoriaProducto.findMany({ orderBy: { nombre: 'asc' }, include: CATEGORIA_CON_CONTEO });

const buscarPorId = (id) => prisma.categoriaProducto.findUnique({ where: { id } });

const crear = (data) => prisma.categoriaProducto.create({ data });

const actualizar = (id, data) =>
  prisma.categoriaProducto.update({ where: { id }, data, include: CATEGORIA_CON_CONTEO });

const eliminar = (id) => prisma.categoriaProducto.delete({ where: { id } });

export { listar, buscarPorId, crear, actualizar, eliminar };
