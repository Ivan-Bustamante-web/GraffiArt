// SCHEMA (VALIDACIÓN)
// El schema define cómo tienen que venir los datos que envía el usuario: qué campos son obligatorios, de qué tipo son y qué largo pueden tener.
// Si los datos no cumplen, la API responde con error 400 y un mensaje claro antes de llegar al controller.
// Debe tener: solo reglas sobre la forma de los datos. No debe tener consultas a la base ni lógica del negocio.
// Este archivo: valida los datos que se envían para el perfil del usuario.

import { z } from 'zod';
import { textoRequerido, textoOpcional } from './common.js';
import { MESSAGES } from '../constants/messages.js';

const updatePerfilSchema = z.object({
  nombre: textoRequerido(MESSAGES.usuario.nameAndSurnameRequired),
  apellido: textoRequerido(MESSAGES.usuario.nameAndSurnameRequired),
  telefono: textoOpcional,
});

export { updatePerfilSchema };
