// RUTAS
// Las rutas son el mapa de la API: dicen qué dirección (URL) y qué método (GET, POST, PUT, DELETE) corresponde a cada acción.
// Debe tener: la dirección, el método, los filtros que se aplican antes (estar logueado, ser admin, validar los datos) y el controller que atiende el pedido.
// No debe tener: lógica ni consultas a la base de datos.
// Este archivo: define las direcciones del inicio de sesión y el registro.

import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/login', validate(loginSchema), controller.login);
router.post('/register', validate(registerSchema), controller.register);

export default router;
