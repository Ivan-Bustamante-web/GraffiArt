// SERVICE
// El service tiene las reglas del negocio: lo que la aplicación decide y controla. Por ejemplo, "no puede haber dos cuentas con el mismo email".
// Debe tener: validaciones del negocio, cálculos y errores propios (AppError). Para leer o guardar datos usa los repositories.
// No debe tener: nada de req/res (lo propio del controller) ni consultas directas a la base de datos.
// Este archivo: tiene las reglas del inicio de sesión y el registro.

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import * as usuarioRepository from '../repositories/usuario.repository.js';
import AppError from '../utils/AppError.js';
import { toPublicUser } from './usuario.service.js';
import { MESSAGES } from '../constants/messages.js';
import { BCRYPT_ROUNDS } from '../constants/security.js';

const registrar = async ({ nombre, apellido, email, password, telefono }) => {
  const existente = await usuarioRepository.buscarPorEmail(email);
  if (existente) throw AppError.conflict(MESSAGES.auth.emailTaken);

  await usuarioRepository.crear({
    nombre,
    apellido,
    email,
    telefono: telefono ?? null,
    passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
  });

  return { message: MESSAGES.auth.registered };
};

const login = async ({ email, password }) => {
  const usuario = await usuarioRepository.buscarPorEmail(email);
  const credencialesValidas = usuario && (await bcrypt.compare(password, usuario.passwordHash));

  if (!credencialesValidas) {
    throw AppError.unauthorized(MESSAGES.auth.invalidCredentials);
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  return { token, usuario: toPublicUser(usuario) };
};

export { registrar, login };
