// CONSTANTES
// Aquí viven los valores fijos del proyecto (textos, números, listas) en un solo lugar, para no repetirlos ni escribirlos a mano en otros archivos.
// Debe tener: solo datos. Se importan donde hacen falta.
// No debe tener: lógica ni funciones complejas.
// Este archivo: guarda códigos de error de Prisma y consultas fijas que se repiten.

export const PRISMA_ERRORS = {
  duplicate: 'P2002',
  related: 'P2003',
  notFound: 'P2025',
};

export const PRISMA_ERROR_STATUS = {
  [PRISMA_ERRORS.duplicate]: 409,
  [PRISMA_ERRORS.related]: 409,
  [PRISMA_ERRORS.notFound]: 404,
};

export const CATEGORIA_CON_CONTEO = { _count: { select: { productos: true } } };

export const GABINETE_CON_CATEGORIA = { categoria: true };

export const CARRITO_CON_ITEMS = {
  items: {
    include: { gabinete: true, disenoGuardado: true },
    orderBy: { createdAt: 'desc' },
  },
};

export const USUARIO_SELECT_PUBLICO = {
  id: true,
  nombre: true,
  apellido: true,
  email: true,
  telefono: true,
  rol: true,
};
