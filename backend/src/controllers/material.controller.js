const prisma = require('../lib/prisma');

// Crear un material
async function crearMaterial(req, res) {
  try {
    const material = await prisma.material.create({ data: req.body });
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Listar todos los materiales
async function listarMateriales(req, res) {
  try {
    const materiales = await prisma.material.findMany();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Ver un material por id
async function obtenerMaterial(req, res) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: req.params.id },
    });
    if (!material) return res.status(404).json({ error: 'Material no encontrado' });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Editar un material
async function editarMaterial(req, res) {
  try {
    const material = await prisma.material.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminar un material
async function eliminarMaterial(req, res) {
  try {
    await prisma.material.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  crearMaterial,
  listarMateriales,
  obtenerMaterial,
  editarMaterial,
  eliminarMaterial,
};