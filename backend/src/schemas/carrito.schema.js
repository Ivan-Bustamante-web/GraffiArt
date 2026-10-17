// SCHEMA (VALIDACIÓN)
// El schema define cómo tienen que venir los datos que envía el usuario: qué campos son obligatorios, de qué tipo son y qué largo pueden tener.
// Si los datos no cumplen, la API responde con error 400 y un mensaje claro antes de llegar al controller.
// Debe tener: solo reglas sobre la forma de los datos. No debe tener consultas a la base ni lógica del negocio.
// Este archivo: valida los datos que se envían para el carrito de compras.

import { z } from 'zod';
import { MESSAGES } from '../constants/messages.js';

const addItemSchema = z
  .object({
    gabineteId: z.string().trim().min(1).optional(),
    disenoGuardadoId: z.string().trim().min(1).optional(),
    cantidad: z.coerce.number().int().positive().catch(1).default(1),
  })
  .refine((datos) => datos.gabineteId || datos.disenoGuardadoId, {
    message: MESSAGES.carrito.noProduct,
  });

const updateItemSchema = z.object({
  cantidad: z.coerce
    .number({ error: MESSAGES.carrito.quantity })
    .int(MESSAGES.carrito.quantity)
    .positive(MESSAGES.carrito.quantity),
});

export { addItemSchema, updateItemSchema };
