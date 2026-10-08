const express = require('express');
const router = express.Router();
const {
  listarCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
} = require('../controllers/categoria.controller');
const {
  verificarToken,
  verificarAdmin,
} = require('../middleware/auth.middleware');

router.use(verificarToken, verificarAdmin);

router.get('/', listarCategorias);
router.post('/', crearCategoria);
router.put('/:id', editarCategoria);
router.delete('/:id', eliminarCategoria);

module.exports = router;
