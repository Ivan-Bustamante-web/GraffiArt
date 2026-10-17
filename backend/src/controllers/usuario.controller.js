// CONTROLLER
// El controller recibe el pedido del usuario, se lo pasa al service y devuelve la respuesta (con su código: 200, 201, 204...).
// Debe tener: funciones cortas que leen los datos que llegaron (body, params, usuario logueado), llaman a un service y responden.
// No debe tener: reglas del negocio ni consultas a la base de datos.
// Este archivo: recibe y responde los pedidos del perfil del usuario.

import * as usuarioService from '../services/usuario.service.js';

const getPerfil = async (req, res) => {
  res.json(await usuarioService.obtenerPerfil(req.usuario.id));
};

const updatePerfil = async (req, res) => {
  res.json(await usuarioService.actualizarPerfil(req.usuario.id, req.body));
};

export { getPerfil, updatePerfil };
