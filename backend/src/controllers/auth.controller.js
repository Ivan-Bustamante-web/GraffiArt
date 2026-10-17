// CONTROLLER
// El controller recibe el pedido del usuario, se lo pasa al service y devuelve la respuesta (con su código: 200, 201, 204...).
// Debe tener: funciones cortas que leen los datos que llegaron (body, params, usuario logueado), llaman a un service y responden.
// No debe tener: reglas del negocio ni consultas a la base de datos.
// Este archivo: recibe y responde los pedidos del inicio de sesión y el registro.

import * as authService from '../services/auth.service.js';

const register = async (req, res) => {
  res.status(201).json(await authService.registrar(req.body));
};

const login = async (req, res) => {
  res.json(await authService.login(req.body));
};

export { register, login };
