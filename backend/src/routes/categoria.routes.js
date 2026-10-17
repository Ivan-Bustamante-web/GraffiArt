// RUTAS
// Las rutas son el mapa de la API: dicen qué dirección (URL) y qué método (GET, POST, PUT, DELETE) corresponde a cada acción.
// Debe tener: la dirección, el método, los filtros que se aplican antes (estar logueado, ser admin, validar los datos) y el controller que atiende el pedido.
// No debe tener: lógica ni consultas a la base de datos.
// Este archivo: define las direcciones de las categorías de productos.

import { Router } from 'express';
import * as controller from '../controllers/categoria.controller.js';
import { authenticate, requireAdmin } from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';
import { createCategoriaSchema, updateCategoriaSchema } from '../schemas/categoria.schema.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', controller.listarCategorias);
router.post('/', validate(createCategoriaSchema), controller.crearCategoria);
router.put('/:id', validate(updateCategoriaSchema), controller.editarCategoria);
router.delete('/:id', controller.eliminarCategoria);

export default router;
