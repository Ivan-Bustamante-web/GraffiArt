// MIDDLEWARE
// Revisa los datos que envía el usuario usando un schema. Si están mal, corta con un error 400.

import AppError from '../utils/AppError.js';

const validate = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body ?? {});
  if (!resultado.success) {
    throw AppError.badRequest(resultado.error.issues[0].message);
  }
  req.body = resultado.data;
  next();
};

export default validate;
