// REPOSITORY
// El repository es el único que habla con la base de datos. Cada función es una consulta simple: buscar, listar, crear, actualizar o borrar.
// Debe tener: consultas de Prisma y nada más; devuelve los datos tal cual vienen.
// No debe tener: reglas del negocio ni mensajes de error para el usuario (eso es del service).
// Este archivo: hace las consultas a la base de datos del perfil del usuario.

import prisma from '../lib/prisma.js';
import { USUARIO_SELECT_PUBLICO } from '../constants/prisma.js';

const buscarPorEmail = (email) => prisma.usuario.findUnique({ where: { email } });

const buscarPerfil = (id) =>
  prisma.usuario.findUnique({
    where: { id },
    select: { ...USUARIO_SELECT_PUBLICO, fechaRegistro: true },
  });

const crear = (data) => prisma.usuario.create({ data });

const actualizarPerfil = (id, data) =>
  prisma.usuario.update({ where: { id }, data, select: USUARIO_SELECT_PUBLICO });

const crearOActualizarAdmin = ({ email, create, update }) =>
  prisma.usuario.upsert({ where: { email }, create, update });

export { buscarPorEmail, buscarPerfil, crear, actualizarPerfil, crearOActualizarAdmin };
