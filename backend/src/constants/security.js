// CONSTANTES
// Aquí viven los valores fijos del proyecto (textos, números, listas) en un solo lugar, para no repetirlos ni escribirlos a mano en otros archivos.
// Debe tener: solo datos. Se importan donde hacen falta.
// No debe tener: lógica ni funciones complejas.
// Este archivo: guarda valores de seguridad: rondas de encriptación, largo mínimo de contraseña, formato del token.

export const BCRYPT_ROUNDS = 10;
export const MIN_PASSWORD_LENGTH = 8;
export const BEARER_PREFIX = 'Bearer ';
