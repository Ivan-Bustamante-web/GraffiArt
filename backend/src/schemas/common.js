// SCHEMA (VALIDACIÓN)
// Piezas reutilizables para armar los demás schemas (texto obligatorio, número no negativo, etc.).

import { z } from 'zod';

const textoRequerido = (mensaje) => z.string({ error: mensaje }).trim().min(1, mensaje);

const textoOpcional = z
  .union([z.string().trim().transform((valor) => valor || null), z.null()])
  .optional();

const numeroNoNegativo = (mensaje) =>
  z.coerce.number({ error: mensaje }).min(0, mensaje);

const enteroNoNegativo = (mensaje) =>
  z.coerce.number({ error: mensaje }).int(mensaje).min(0, mensaje);

const idOpcional = z
  .union([z.string().trim().transform((valor) => valor || null), z.null()])
  .optional();

export {
  textoRequerido,
  textoOpcional,
  numeroNoNegativo,
  enteroNoNegativo,
  idOpcional,
};
