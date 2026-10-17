// REPOSITORY
// El repository es el único que habla con la base de datos. Cada función es una consulta simple: buscar, listar, crear, actualizar o borrar.
// Debe tener: consultas de Prisma y nada más; devuelve los datos tal cual vienen.
// No debe tener: reglas del negocio ni mensajes de error para el usuario (eso es del service).
// Este archivo: hace las consultas a la base de datos del carrito de compras.

import prisma from '../lib/prisma.js';
import { CARRITO_CON_ITEMS } from '../constants/prisma.js';

const obtenerOCrear = (usuarioId) =>
  prisma.carrito.upsert({
    where: { usuarioId },
    create: { usuarioId },
    update: {},
    include: CARRITO_CON_ITEMS,
  });

const buscarItemDelUsuario = (id, usuarioId) =>
  prisma.itemCarrito.findFirst({ where: { id, carrito: { usuarioId } } });

const buscarItemIgual = ({ carritoId, gabineteId, disenoGuardadoId }) =>
  prisma.itemCarrito.findFirst({
    where: { carritoId, gabineteId: gabineteId ?? null, disenoGuardadoId: disenoGuardadoId ?? null },
  });

const crearItem = (data) => prisma.itemCarrito.create({ data });

const sumarCantidad = (id, cantidad) =>
  prisma.itemCarrito.update({ where: { id }, data: { cantidad: { increment: cantidad } } });

const actualizarCantidad = (id, cantidad) =>
  prisma.itemCarrito.update({ where: { id }, data: { cantidad } });

const eliminarItem = (id) => prisma.itemCarrito.delete({ where: { id } });

export {
  obtenerOCrear,
  buscarItemDelUsuario,
  buscarItemIgual,
  crearItem,
  sumarCantidad,
  actualizarCantidad,
  eliminarItem,
};
