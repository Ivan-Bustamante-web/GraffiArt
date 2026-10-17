// REPOSITORY
// El repository es el único que habla con la base de datos. Cada función es una consulta simple: buscar, listar, crear, actualizar o borrar.
// Debe tener: consultas de Prisma y nada más; devuelve los datos tal cual vienen.
// No debe tener: reglas del negocio ni mensajes de error para el usuario (eso es del service).
// Este archivo: hace las consultas a la base de datos de los gabinetes. Lo usan tanto el catálogo público como los productos del administrador.

import prisma from '../lib/prisma.js';
import { GABINETE_CON_CATEGORIA } from '../constants/prisma.js';

const listarConCategoria = () =>
  prisma.gabinete.findMany({ include: GABINETE_CON_CATEGORIA, orderBy: { createdAt: 'desc' } });

const listarActivos = () => prisma.gabinete.findMany({ where: { activo: true } });

const buscarPorId = (id) => prisma.gabinete.findUnique({ where: { id } });

const buscarConCategoria = (id) =>
  prisma.gabinete.findUnique({ where: { id }, include: GABINETE_CON_CATEGORIA });

const crear = (data) => prisma.gabinete.create({ data, include: GABINETE_CON_CATEGORIA });

const actualizar = (id, data) =>
  prisma.gabinete.update({ where: { id }, data, include: GABINETE_CON_CATEGORIA });

const eliminar = (id) => prisma.gabinete.delete({ where: { id } });

export {
  listarConCategoria,
  listarActivos,
  buscarPorId,
  buscarConCategoria,
  crear,
  actualizar,
  eliminar,
};
