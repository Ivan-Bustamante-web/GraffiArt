// CONFIGURACIÓN
// Lee y revisa la configuración que viene del archivo .env (base de datos, puerto, secretos).
// Si falta algo importante, el servidor avisa y no arranca, para no fallar más tarde con errores confusos.
// Este archivo: lee las variables del .env y las valida con Zod.

import 'dotenv/config';
import { z } from 'zod';
import {
  DEFAULT_FRONTEND_URL,
  ENVIRONMENTS,
  DEFAULT_JWT_EXPIRES_IN,
  DEFAULT_NODE_ENV,
  DEFAULT_PORT,
  MIN_JWT_SECRET_LENGTH,
  NODE_ENVS,
} from '../constants/config.js';
import { MESSAGES } from '../constants/messages.js';

const envSchema = z.object({
  NODE_ENV: z.enum(NODE_ENVS).default(DEFAULT_NODE_ENV),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  DATABASE_URL: z.string().min(1, MESSAGES.env.databaseUrl),
  JWT_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH, MESSAGES.env.jwtSecret),
  JWT_EXPIRES_IN: z.string().default(DEFAULT_JWT_EXPIRES_IN),
  FRONTEND_URL: z.url().default(DEFAULT_FRONTEND_URL),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const problemas = parsed.error.issues
    .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error(MESSAGES.env.invalid(problemas));
  process.exit(1);
}

const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === ENVIRONMENTS.production,
};

export default env;
