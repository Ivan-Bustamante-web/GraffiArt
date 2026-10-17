// CONTROLLER
// El controller recibe el pedido del usuario, se lo pasa al service y devuelve la respuesta (con su código: 200, 201, 204...).
// Debe tener: funciones cortas que leen los datos que llegaron (body, params, usuario logueado), llaman a un service y responden.
// No debe tener: reglas del negocio ni consultas a la base de datos.
// Este archivo: recibe y responde los pedidos del carrito de compras.

import * as carritoService from '../services/carrito.service.js';

const obtenerCarrito = async (req, res) => {
  res.json(await carritoService.obtener(req.usuario.id));
};

const agregarItem = async (req, res) => {
  res.status(201).json(await carritoService.agregarItem(req.usuario.id, req.body));
};

const actualizarCantidadItem = async (req, res) => {
  res.json(
    await carritoService.actualizarCantidad(req.usuario.id, req.params.id, req.body.cantidad),
  );
};

const eliminarItem = async (req, res) => {
  res.json(await carritoService.eliminarItem(req.usuario.id, req.params.id));
};

export { obtenerCarrito, agregarItem, actualizarCantidadItem, eliminarItem };
