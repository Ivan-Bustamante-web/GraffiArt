// RUTAS
// Junta todas las rutas de la API y les pone su dirección base (por ejemplo /categorias).
// Cada recurso nuevo se registra acá.

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import usuarioRoutes from './usuario.routes.js';
import categoriaRoutes from './categoria.routes.js';
import productoRoutes from './producto.routes.js';
import gabineteRoutes from './gabinete.routes.js';
import materialRoutes from './material.routes.js';
import disenoRoutes from './diseno.routes.js';
import carritoRoutes from './carrito.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/productos', productoRoutes);
router.use('/gabinetes', gabineteRoutes);
router.use('/materiales', materialRoutes);
router.use('/disenos', disenoRoutes);
router.use('/carrito', carritoRoutes);

export default router;
