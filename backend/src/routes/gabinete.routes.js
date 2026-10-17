// RUTAS
// Las rutas son el mapa de la API: dicen qué dirección (URL) y qué método (GET, POST, PUT, DELETE) corresponde a cada acción.
// Debe tener: la dirección, el método, los filtros que se aplican antes (estar logueado, ser admin, validar los datos) y el controller que atiende el pedido.
// No debe tener: lógica ni consultas a la base de datos.
// Este archivo: define las direcciones del catálogo público de gabinetes.

import { Router } from 'express';
import * as controller from '../controllers/gabinete.controller.js';

const router = Router();

router.get('/', controller.obtenerGabinetes);
router.get('/:id', controller.obtenerGabinetePorId);

export default router;
