const express = require('express');
const router = express.Router();
const { obtenerGabinetes, obtenerGabinetePorId } = require('../controllers/gabinete.controller');

router.get('/', obtenerGabinetes);

router.get('/:id', obtenerGabinetePorId);

module.exports = router;