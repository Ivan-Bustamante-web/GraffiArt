// CONEXIÓN EXTERNA
// Guarda la conexión a una herramienta externa (acá, la base de datos) que se crea una sola vez y se reutiliza en todo el proyecto.
// Este archivo: crea el cliente de Prisma conectado a MySQL.

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import env from '../config/env.js';

const adapter = new PrismaMariaDb(env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export default prisma;
