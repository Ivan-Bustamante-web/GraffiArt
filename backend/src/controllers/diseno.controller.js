// CONTROLLER
// El controller recibe el pedido del usuario, se lo pasa al service y devuelve la respuesta (con su código: 200, 201, 204...).
// Debe tener: funciones cortas que leen los datos que llegaron (body, params, usuario logueado), llaman a un service y responden.
// No debe tener: reglas del negocio ni consultas a la base de datos.
// Este archivo: recibe y responde los pedidos de los diseños guardados de cada usuario.

import * as disenoService from '../services/diseno.service.js';

const listarDisenos = async (req, res) => {
  res.json(await disenoService.listar(req.usuario.id));
};

const crearDiseno = async (req, res) => {
  res.status(201).json(await disenoService.crear(req.usuario.id, req.body));
};

const actualizarDiseno = async (req, res) => {
  res.json(await disenoService.actualizar(req.params.id, req.usuario.id, req.body));
};

const eliminarDiseno = async (req, res) => {
  await disenoService.eliminar(req.params.id, req.usuario.id);
  res.status(204).send();
};

export { listarDisenos, crearDiseno, actualizarDiseno, eliminarDiseno };
