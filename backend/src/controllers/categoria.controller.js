// CONTROLLER
// El controller recibe el pedido del usuario, se lo pasa al service y devuelve la respuesta (con su código: 200, 201, 204...).
// Debe tener: funciones cortas que leen los datos que llegaron (body, params, usuario logueado), llaman a un service y responden.
// No debe tener: reglas del negocio ni consultas a la base de datos.
// Este archivo: recibe y responde los pedidos de las categorías de productos.

import * as categoriaService from '../services/categoria.service.js';

const listarCategorias = async (req, res) => {
  res.json(await categoriaService.listar());
};

const crearCategoria = async (req, res) => {
  res.status(201).json(await categoriaService.crear(req.body));
};

const editarCategoria = async (req, res) => {
  res.json(await categoriaService.editar(req.params.id, req.body));
};

const eliminarCategoria = async (req, res) => {
  await categoriaService.eliminar(req.params.id);
  res.status(204).send();
};

export { listarCategorias, crearCategoria, editarCategoria, eliminarCategoria };
