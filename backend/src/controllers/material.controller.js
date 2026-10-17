// CONTROLLER
// El controller recibe el pedido del usuario, se lo pasa al service y devuelve la respuesta (con su código: 200, 201, 204...).
// Debe tener: funciones cortas que leen los datos que llegaron (body, params, usuario logueado), llaman a un service y responden.
// No debe tener: reglas del negocio ni consultas a la base de datos.
// Este archivo: recibe y responde los pedidos de los materiales del inventario.

import * as materialService from '../services/material.service.js';

const listarMateriales = async (req, res) => {
  res.json(await materialService.listar());
};

const obtenerMaterial = async (req, res) => {
  res.json(await materialService.obtener(req.params.id));
};

const crearMaterial = async (req, res) => {
  res.status(201).json(await materialService.crear(req.body));
};

const editarMaterial = async (req, res) => {
  res.json(await materialService.editar(req.params.id, req.body));
};

const eliminarMaterial = async (req, res) => {
  await materialService.eliminar(req.params.id);
  res.status(204).send();
};

export {
  listarMateriales,
  obtenerMaterial,
  crearMaterial,
  editarMaterial,
  eliminarMaterial,
};
