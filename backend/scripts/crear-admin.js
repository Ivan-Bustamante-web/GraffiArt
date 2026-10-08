const { randomUUID } = require('crypto');

require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../src/lib/prisma');

async function crearAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Configurá ADMIN_EMAIL y ADMIN_PASSWORD antes de ejecutar este script.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.usuario.upsert({
    where: { email },
    update: {
      rol: 'ADMIN',
      emailVerificado: true,
      passwordHash,
    },
    create: {
      id: randomUUID(),
      nombre: 'Administrador',
      apellido: 'GraffiArt',
      email,
      passwordHash,
      rol: 'ADMIN',
      emailVerificado: true,
    },
  });

  console.log(`Administrador listo: ${admin.email}`);
  console.log(`Rol: ${admin.rol}`);
}

crearAdmin()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
