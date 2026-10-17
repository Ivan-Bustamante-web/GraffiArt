// SEED (DATOS INICIALES)
// Carga los datos iniciales en la base: categorías, gabinetes y el administrador.
// Se puede correr varias veces sin duplicar nada. Se ejecuta con: npm run seed

import env from '../src/config/env.js';
import prisma from '../src/lib/prisma.js';
import { asegurarAdmin } from '../src/services/usuario.service.js';
import { CATEGORIAS } from './seed-data/categorias.js';
import { GABINETES } from './seed-data/gabinetes.js';

const seedCategorias = async () => {
  for (const categoria of CATEGORIAS) {
    await prisma.categoriaProducto.upsert({
      where: { nombre: categoria.nombre },
      update: { descripcion: categoria.descripcion },
      create: categoria,
    });
  }
  console.log('Categorías cargadas.');
};

const seedGabinetes = async () => {
  for (const gabinete of GABINETES) {
    await prisma.gabinete.upsert({
      where: { id: gabinete.id },
      update: { nombre: gabinete.nombre, costoUnitario: gabinete.costoUnitario },
      create: gabinete,
    });
  }
  console.log('Gabinetes cargados.');
};

const seedAdmin = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.warn('ADMIN_EMAIL y ADMIN_PASSWORD no están definidos: se omite el administrador.');
    return;
  }
  await asegurarAdmin({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    actualizarPassword: false,
  });
  console.log(`Administrador listo: ${env.ADMIN_EMAIL}`);
};

const main = async () => {
  await seedCategorias();
  await seedGabinetes();
  await seedAdmin();
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
