// SERVICE
// El service tiene las reglas del negocio: lo que la aplicación decide y controla. Por ejemplo, "no puede haber dos cuentas con el mismo email".
// Debe tener: validaciones del negocio, cálculos y errores propios (AppError). Para leer o guardar datos usa los repositories.
// No debe tener: nada de req/res (lo propio del controller) ni consultas directas a la base de datos.
// Este archivo: tiene las reglas del perfil del usuario.

import bcrypt from 'bcrypt';
import * as usuarioRepository from '../repositories/usuario.repository.js';
import AppError from '../utils/AppError.js';
import { MESSAGES } from '../constants/messages.js';
import { ADMIN_DEFAULTS } from '../constants/business.js';
import { ROLES } from '../constants/roles.js';
import { BCRYPT_ROUNDS } from '../constants/security.js';

const toPublicUser = ({ id, nombre, apellido, email, telefono, rol }) => ({
  id,
  nombre,
  apellido,
  email,
  telefono,
  rol,
});

const obtenerPerfil = async (usuarioId) => {
  const usuario = await usuarioRepository.buscarPerfil(usuarioId);
  if (!usuario) throw AppError.notFound(MESSAGES.usuario.notFound);
  return usuario;
};

const actualizarPerfil = (usuarioId, { nombre, apellido, telefono }) =>
  usuarioRepository.actualizarPerfil(usuarioId, { nombre, apellido, telefono: telefono ?? null });

const asegurarAdmin = async ({ email, password, actualizarPassword = true }) => {
  const emailNormalizado = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  return usuarioRepository.crearOActualizarAdmin({
    email: emailNormalizado,
    update: { rol: ROLES.admin, ...(actualizarPassword && { passwordHash }) },
    create: {
      ...ADMIN_DEFAULTS,
      email: emailNormalizado,
      passwordHash,
      rol: ROLES.admin,
    },
  });
};

export { toPublicUser, obtenerPerfil, actualizarPerfil, asegurarAdmin };
