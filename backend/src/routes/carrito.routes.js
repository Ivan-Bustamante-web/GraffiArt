// RUTAS
// Las rutas son el mapa de la API: dicen qué dirección (URL) y qué método (GET, POST, PUT, DELETE) corresponde a cada acción.
// Debe tener: la dirección, el método, los filtros que se aplican antes (estar logueado, ser admin, validar los datos) y el controller que atiende el pedido.
// No debe tener: lógica ni consultas a la base de datos.
// Este archivo: define las direcciones del carrito de compras.

import { Router } from 'express';
import * as controller from '../controllers/carrito.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';
import { addItemSchema, updateItemSchema } from '../schemas/carrito.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', controller.obtenerCarrito);
router.post('/items', validate(addItemSchema), controller.agregarItem);
router.put('/items/:id', validate(updateItemSchema), controller.actualizarCantidadItem);
router.delete('/items/:id', controller.eliminarItem);

export default router;
