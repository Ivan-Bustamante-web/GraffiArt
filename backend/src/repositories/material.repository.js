// REPOSITORY
// El repository es el único que habla con la base de datos. Cada función es una consulta simple: buscar, listar, crear, actualizar o borrar.
// Debe tener: consultas de Prisma y nada más; devuelve los datos tal cual vienen.
// No debe tener: reglas del negocio ni mensajes de error para el usuario (eso es del service).
// Este archivo: hace las consultas a la base de datos de los materiales del inventario.

import prisma from '../lib/prisma.js';

const listar = () => prisma.material.findMany({ orderBy: { createdAt: 'desc' } });

const buscarPorId = (id) => prisma.material.findUnique({ where: { id } });

const crear = (data) => prisma.material.create({ data });

const actualizar = (id, data) => prisma.material.update({ where: { id }, data });

const eliminar = (id) => prisma.material.delete({ where: { id } });

export { listar, buscarPorId, crear, actualizar, eliminar };
