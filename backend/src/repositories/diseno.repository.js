// REPOSITORY
// El repository es el único que habla con la base de datos. Cada función es una consulta simple: buscar, listar, crear, actualizar o borrar.
// Debe tener: consultas de Prisma y nada más; devuelve los datos tal cual vienen.
// No debe tener: reglas del negocio ni mensajes de error para el usuario (eso es del service).
// Este archivo: hace las consultas a la base de datos de los diseños guardados de cada usuario.

import prisma from '../lib/prisma.js';

const listarPorUsuario = (usuarioId) =>
  prisma.disenoGuardado.findMany({ where: { usuarioId }, orderBy: { updatedAt: 'desc' } });

const buscarDelUsuario = (id, usuarioId) =>
  prisma.disenoGuardado.findFirst({ where: { id, usuarioId } });

const crear = (data) => prisma.disenoGuardado.create({ data });

const actualizar = (id, data) => prisma.disenoGuardado.update({ where: { id }, data });

const eliminar = (id) => prisma.disenoGuardado.delete({ where: { id } });

export { listarPorUsuario, buscarDelUsuario, crear, actualizar, eliminar };
