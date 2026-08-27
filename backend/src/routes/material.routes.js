const express = require('express');
const router = express.Router();
const {
  crearMaterial,
  listarMateriales,
  obtenerMaterial,
  editarMaterial,
  eliminarMaterial,
} = require('../controllers/material.controller');

router.post('/', crearMaterial);
router.get('/', listarMateriales);
router.get('/:id', obtenerMaterial);
router.put('/:id', editarMaterial);
router.delete('/:id', eliminarMaterial);

module.exports = router;