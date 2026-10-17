// SCRIPT
// Crea (o actualiza) el usuario administrador con ADMIN_EMAIL y ADMIN_PASSWORD del .env.
// Se ejecuta con: npm run crear-admin

import env from '../src/config/env.js';
import prisma from '../src/lib/prisma.js';
import { asegurarAdmin } from '../src/services/usuario.service.js';

const main = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error('Configurá ADMIN_EMAIL y ADMIN_PASSWORD antes de ejecutar este script.');
  }

  const admin = await asegurarAdmin({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD });
  console.log(`Administrador listo: ${admin.email}`);
  console.log(`Rol: ${admin.rol}`);
};

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
