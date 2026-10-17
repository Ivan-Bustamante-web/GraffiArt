// SERVICE
// El service tiene las reglas del negocio: lo que la aplicación decide y controla. Por ejemplo, "no puede haber dos cuentas con el mismo email".
// Debe tener: validaciones del negocio, cálculos y errores propios (AppError). Para leer o guardar datos usa los repositories.
// No debe tener: nada de req/res (lo propio del controller) ni consultas directas a la base de datos.
// Este archivo: tiene las reglas del carrito de compras.

import * as carritoRepository from '../repositories/carrito.repository.js';
import * as disenoRepository from '../repositories/diseno.repository.js';
import * as gabineteRepository from '../repositories/gabinete.repository.js';
import AppError from '../utils/AppError.js';
import { serializarGabinete } from '../utils/serializers.js';
import { MESSAGES } from '../constants/messages.js';
import { COSTO_DISENO } from '../constants/business.js';

const conTotales = (carrito) => {
  const items = carrito.items.map((item) => {
    const precioUnitario = Number(item.precioUnitario);
    return {
      ...item,
      precioUnitario,
      gabinete: serializarGabinete(item.gabinete),
      subtotal: precioUnitario * item.cantidad,
    };
  });

  return { ...carrito, items, total: items.reduce((acc, item) => acc + item.subtotal, 0) };
};

const obtener = async (usuarioId) => conTotales(await carritoRepository.obtenerOCrear(usuarioId));

const verificarItemDelUsuario = async (id, usuarioId) => {
  const item = await carritoRepository.buscarItemDelUsuario(id, usuarioId);
  if (!item) throw AppError.notFound(MESSAGES.carrito.itemNotFound);
};

const calcularPrecioUnitario = async (usuarioId, { gabineteId, disenoGuardadoId }) => {
  let precioUnitario = 0;

  if (gabineteId) {
    const gabinete = await gabineteRepository.buscarPorId(gabineteId);
    if (!gabinete?.activo) throw AppError.notFound(MESSAGES.carrito.cabinetUnavailable);
    precioUnitario += Number(gabinete.costoUnitario);
  }

  if (disenoGuardadoId) {
    const diseno = await disenoRepository.buscarDelUsuario(disenoGuardadoId, usuarioId);
    if (!diseno) throw AppError.notFound(MESSAGES.carrito.designNotFound);
    precioUnitario += COSTO_DISENO;
  }

  return precioUnitario;
};

const agregarItem = async (usuarioId, { gabineteId, disenoGuardadoId, cantidad }) => {
  const precioUnitario = await calcularPrecioUnitario(usuarioId, { gabineteId, disenoGuardadoId });
  const carrito = await carritoRepository.obtenerOCrear(usuarioId);
  const existente = await carritoRepository.buscarItemIgual({
    carritoId: carrito.id,
    gabineteId,
    disenoGuardadoId,
  });

  if (existente) {
    await carritoRepository.sumarCantidad(existente.id, cantidad);
  } else {
    await carritoRepository.crearItem({
      carritoId: carrito.id,
      gabineteId: gabineteId ?? null,
      disenoGuardadoId: disenoGuardadoId ?? null,
      cantidad,
      precioUnitario,
    });
  }

  return obtener(usuarioId);
};

const actualizarCantidad = async (usuarioId, id, cantidad) => {
  await verificarItemDelUsuario(id, usuarioId);
  await carritoRepository.actualizarCantidad(id, cantidad);
  return obtener(usuarioId);
};

const eliminarItem = async (usuarioId, id) => {
  await verificarItemDelUsuario(id, usuarioId);
  await carritoRepository.eliminarItem(id);
  return obtener(usuarioId);
};

export { obtener, agregarItem, actualizarCantidad, eliminarItem };
