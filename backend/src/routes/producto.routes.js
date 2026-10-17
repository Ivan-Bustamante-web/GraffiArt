// RUTAS
// Las rutas son el mapa de la API: dicen qué dirección (URL) y qué método (GET, POST, PUT, DELETE) corresponde a cada acción.
// Debe tener: la dirección, el método, los filtros que se aplican antes (estar logueado, ser admin, validar los datos) y el controller que atiende el pedido.
// No debe tener: lógica ni consultas a la base de datos.
// Este archivo: define las direcciones de los productos (gabinetes) que gestiona el administrador.

import { Router } from 'express';
import * as controller from '../controllers/producto.controller.js';
import { authenticate, requireAdmin } from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';
import { createProductoSchema, updateProductoSchema } from '../schemas/producto.schema.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', controller.listarProductos);
router.get('/:id', controller.obtenerProducto);
router.post('/', validate(createProductoSchema), controller.crearProducto);
router.put('/:id', validate(updateProductoSchema), controller.editarProducto);
router.delete('/:id', controller.eliminarProducto);

export default router;
