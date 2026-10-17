// RUTAS
// Las rutas son el mapa de la API: dicen qué dirección (URL) y qué método (GET, POST, PUT, DELETE) corresponde a cada acción.
// Debe tener: la dirección, el método, los filtros que se aplican antes (estar logueado, ser admin, validar los datos) y el controller que atiende el pedido.
// No debe tener: lógica ni consultas a la base de datos.
// Este archivo: define las direcciones de los diseños guardados de cada usuario.

import { Router } from 'express';
import * as controller from '../controllers/diseno.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';
import { createDisenoSchema, updateDisenoSchema } from '../schemas/diseno.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', controller.listarDisenos);
router.post('/', validate(createDisenoSchema), controller.crearDiseno);
router.put('/:id', validate(updateDisenoSchema), controller.actualizarDiseno);
router.delete('/:id', controller.eliminarDiseno);

export default router;
