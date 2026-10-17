// RUTAS
// Las rutas son el mapa de la API: dicen qué dirección (URL) y qué método (GET, POST, PUT, DELETE) corresponde a cada acción.
// Debe tener: la dirección, el método, los filtros que se aplican antes (estar logueado, ser admin, validar los datos) y el controller que atiende el pedido.
// No debe tener: lógica ni consultas a la base de datos.
// Este archivo: define las direcciones de los materiales del inventario.

import { Router } from 'express';
import * as controller from '../controllers/material.controller.js';
import { authenticate, requireAdmin } from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';
import { createMaterialSchema, updateMaterialSchema } from '../schemas/material.schema.js';

const router = Router();

router.get('/', controller.listarMateriales);
router.get('/:id', controller.obtenerMaterial);

router.post('/', authenticate, requireAdmin, validate(createMaterialSchema), controller.crearMaterial);
router.put('/:id', authenticate, requireAdmin, validate(updateMaterialSchema), controller.editarMaterial);
router.delete('/:id', authenticate, requireAdmin, controller.eliminarMaterial);

export default router;
