// CONTROLLER
// El controller recibe el pedido del usuario, se lo pasa al service y devuelve la respuesta (con su código: 200, 201, 204...).
// Debe tener: funciones cortas que leen los datos que llegaron (body, params, usuario logueado), llaman a un service y responden.
// No debe tener: reglas del negocio ni consultas a la base de datos.
// Este archivo: recibe y responde los pedidos del catálogo público de gabinetes.

import * as gabineteService from '../services/gabinete.service.js';

const obtenerGabinetes = async (req, res) => {
  res.json(await gabineteService.listarActivos());
};

const obtenerGabinetePorId = async (req, res) => {
  res.json(await gabineteService.obtenerActivo(req.params.id));
};

export { obtenerGabinetes, obtenerGabinetePorId };
