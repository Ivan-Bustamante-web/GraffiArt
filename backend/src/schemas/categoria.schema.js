// SCHEMA (VALIDACIÓN)
// El schema define cómo tienen que venir los datos que envía el usuario: qué campos son obligatorios, de qué tipo son y qué largo pueden tener.
// Si los datos no cumplen, la API responde con error 400 y un mensaje claro antes de llegar al controller.
// Debe tener: solo reglas sobre la forma de los datos. No debe tener consultas a la base ni lógica del negocio.
// Este archivo: valida los datos que se envían para las categorías de productos.

import { z } from 'zod';
import { textoRequerido, textoOpcional } from './common.js';
import { MESSAGES } from '../constants/messages.js';

const createCategoriaSchema = z.object({
  nombre: textoRequerido(MESSAGES.categoria.nameRequired),
  descripcion: textoOpcional,
});

const updateCategoriaSchema = z.object({
  nombre: textoRequerido(MESSAGES.categoria.nameRequired).optional(),
  descripcion: textoOpcional,
  activo: z.boolean().optional(),
});

export { createCategoriaSchema, updateCategoriaSchema };
