// SCHEMA (VALIDACIÓN)
// El schema define cómo tienen que venir los datos que envía el usuario: qué campos son obligatorios, de qué tipo son y qué largo pueden tener.
// Si los datos no cumplen, la API responde con error 400 y un mensaje claro antes de llegar al controller.
// Debe tener: solo reglas sobre la forma de los datos. No debe tener consultas a la base ni lógica del negocio.
// Este archivo: valida los datos que se envían para los productos (gabinetes) que gestiona el administrador.

import { z } from 'zod';
import {
  FormatoGabinete,
  MaterialChasis,
  TamanoGabinete,
  TipoPanel,
} from '@prisma/client';
import {
  textoRequerido,
  numeroNoNegativo,
  enteroNoNegativo,
  idOpcional,
} from './common.js';
import { MESSAGES } from '../constants/messages.js';

const createProductoSchema = z.object({
  nombre: textoRequerido(MESSAGES.producto.nameBrandRequired),
  marca: textoRequerido(MESSAGES.producto.nameBrandRequired),
  costoUnitario: numeroNoNegativo(MESSAGES.producto.cost),
  stockActual: enteroNoNegativo(MESSAGES.producto.currentStock),
  stockMinimo: enteroNoNegativo(MESSAGES.producto.minStock),
  tamano: z.enum(TamanoGabinete, { error: MESSAGES.producto.characteristics }),
  formato: z.enum(FormatoGabinete, { error: MESSAGES.producto.characteristics }),
  materialChasis: z.enum(MaterialChasis, { error: MESSAGES.producto.characteristics }),
  panel: z.enum(TipoPanel, { error: MESSAGES.producto.characteristics }),
  categoriaId: idOpcional,
});

const updateProductoSchema = createProductoSchema.partial().extend({
  activo: z.boolean().optional(),
});

export { createProductoSchema, updateProductoSchema };
