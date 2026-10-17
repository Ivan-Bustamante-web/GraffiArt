// RUTAS
// Las rutas son el mapa de la API: dicen qué dirección (URL) y qué método (GET, POST, PUT, DELETE) corresponde a cada acción.
// Debe tener: la dirección, el método, los filtros que se aplican antes (estar logueado, ser admin, validar los datos) y el controller que atiende el pedido.
// No debe tener: lógica ni consultas a la base de datos.
// Este archivo: define las direcciones del perfil del usuario.

import { Router } from 'express';
import * as controller from '../controllers/usuario.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';
import { updatePerfilSchema } from '../schemas/usuario.schema.js';

const router = Router();

router.use(authenticate);

router.get('/perfil', controller.getPerfil);
router.put('/perfil', validate(updatePerfilSchema), controller.updatePerfil);

export default router;
