// SCHEMA (VALIDACIÓN)
// El schema define cómo tienen que venir los datos que envía el usuario: qué campos son obligatorios, de qué tipo son y qué largo pueden tener.
// Si los datos no cumplen, la API responde con error 400 y un mensaje claro antes de llegar al controller.
// Debe tener: solo reglas sobre la forma de los datos. No debe tener consultas a la base ni lógica del negocio.
// Este archivo: valida los datos que se envían para los materiales del inventario.

import { z } from 'zod';
import { CategoriaMaterial, UnidadMedida } from '@prisma/client';
import { textoRequerido, textoOpcional, enteroNoNegativo } from './common.js';
import { MESSAGES } from '../constants/messages.js';

const costoOpcional = z.preprocess(
  (valor) => (valor === '' ? null : valor),
  z.coerce.number({ error: MESSAGES.material.cost }).min(0, MESSAGES.material.costNegative).nullable(),
).optional();

const materialBase = z.object({
  nombre: textoRequerido(MESSAGES.material.nameRequired),
  codigo: textoRequerido(MESSAGES.material.codeRequired),
  categoria: z.enum(CategoriaMaterial, { error: MESSAGES.material.invalidCategory }),
  unidadMedida: z.enum(UnidadMedida, { error: MESSAGES.material.invalidUnit }),
  stockActual: enteroNoNegativo(MESSAGES.material.currentStock),
  stockMinimo: enteroNoNegativo(MESSAGES.material.minStock),
  costoUnitario: costoOpcional,
  descripcion: textoOpcional,
});

const createMaterialSchema = materialBase.extend({
  stockActual: materialBase.shape.stockActual.default(0),
  stockMinimo: materialBase.shape.stockMinimo.default(0),
});

const updateMaterialSchema = materialBase.partial().extend({
  activo: z.boolean().optional(),
});

export { createMaterialSchema, updateMaterialSchema };
