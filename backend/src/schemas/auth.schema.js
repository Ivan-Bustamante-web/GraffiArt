// SCHEMA (VALIDACIÓN)
// El schema define cómo tienen que venir los datos que envía el usuario: qué campos son obligatorios, de qué tipo son y qué largo pueden tener.
// Si los datos no cumplen, la API responde con error 400 y un mensaje claro antes de llegar al controller.
// Debe tener: solo reglas sobre la forma de los datos. No debe tener consultas a la base ni lógica del negocio.
// Este archivo: valida los datos que se envían para el inicio de sesión y el registro.

import { z } from 'zod';
import { textoRequerido, textoOpcional } from './common.js';
import { MESSAGES } from '../constants/messages.js';
import { MIN_PASSWORD_LENGTH } from '../constants/security.js';

const email = textoRequerido(MESSAGES.auth.emailRequired)
  .toLowerCase()
  .pipe(z.email(MESSAGES.auth.emailInvalid));

const password = z
  .string({ error: MESSAGES.auth.passwordMin(MIN_PASSWORD_LENGTH) })
  .min(MIN_PASSWORD_LENGTH, MESSAGES.auth.passwordMin(MIN_PASSWORD_LENGTH));

const loginSchema = z.object({
  email: textoRequerido(MESSAGES.auth.loginRequired).toLowerCase(),
  password: z.string({ error: MESSAGES.auth.loginRequired }).min(1, MESSAGES.auth.loginRequired),
});

const registerSchema = z.object({
  nombre: textoRequerido(MESSAGES.auth.nameRequired),
  apellido: textoRequerido(MESSAGES.auth.surnameRequired),
  email,
  password,
  telefono: textoOpcional,
});

export { loginSchema, registerSchema };
