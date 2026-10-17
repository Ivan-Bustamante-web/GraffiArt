// MIDDLEWARE
// Controla el acceso: authenticate revisa que el usuario haya iniciado sesión y requireAdmin que además sea administrador.

import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import { MESSAGES } from '../constants/messages.js';
import { ROLES } from '../constants/roles.js';
import { BEARER_PREFIX } from '../constants/security.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith(BEARER_PREFIX)) {
    throw AppError.unauthorized(MESSAGES.http.tokenRequired);
  }

  try {
    const token = authHeader.split(' ')[1];
    req.usuario = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch {
    throw AppError.unauthorized(MESSAGES.http.tokenInvalid);
  }
};

const requireAdmin = (req, res, next) => {
  if (req.usuario?.rol !== ROLES.admin) {
    throw AppError.forbidden(MESSAGES.http.adminOnly);
  }
  next();
};

export { authenticate, requireAdmin };
