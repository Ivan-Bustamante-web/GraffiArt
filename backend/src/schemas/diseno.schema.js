// SCHEMA (VALIDACIÓN)
// El schema define cómo tienen que venir los datos que envía el usuario: qué campos son obligatorios, de qué tipo son y qué largo pueden tener.
// Si los datos no cumplen, la API responde con error 400 y un mensaje claro antes de llegar al controller.
// Debe tener: solo reglas sobre la forma de los datos. No debe tener consultas a la base ni lógica del negocio.
// Este archivo: valida los datos que se envían para los diseños guardados de cada usuario.

import { z } from 'zod';
import { textoRequerido } from './common.js';
import { MESSAGES } from '../constants/messages.js';

const createDisenoSchema = z.object({
  nombre: textoRequerido(MESSAGES.diseno.nameConfigRequired),
  descripcion: z.string().trim().optional().default(''),
  configuracion: z.record(z.string(), z.unknown(), { error: MESSAGES.diseno.nameConfigRequired }),
});

const updateDisenoSchema = z.object({
  nombre: textoRequerido(MESSAGES.diseno.nameConfigRequired).optional(),
  descripcion: z.string().trim().optional(),
  configuracion: z.record(z.string(), z.unknown()).optional(),
});

export { createDisenoSchema, updateDisenoSchema };
