// CONTROLLER
// El controller recibe el pedido del usuario, se lo pasa al service y devuelve la respuesta (con su código: 200, 201, 204...).
// Debe tener: funciones cortas que leen los datos que llegaron (body, params, usuario logueado), llaman a un service y responden.
// No debe tener: reglas del negocio ni consultas a la base de datos.
// Este archivo: recibe y responde los pedidos de los productos (gabinetes) que gestiona el administrador.

import * as productoService from '../services/producto.service.js';

const listarProductos = async (req, res) => {
  res.json(await productoService.listar());
};

const obtenerProducto = async (req, res) => {
  res.json(await productoService.obtener(req.params.id));
};

const crearProducto = async (req, res) => {
  res.status(201).json(await productoService.crear(req.body));
};

const editarProducto = async (req, res) => {
  res.json(await productoService.editar(req.params.id, req.body));
};

const eliminarProducto = async (req, res) => {
  await productoService.eliminar(req.params.id);
  res.status(204).send();
};

export {
  listarProductos,
  obtenerProducto,
  crearProducto,
  editarProducto,
  eliminarProducto,
};
