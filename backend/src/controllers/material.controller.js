const { repo } = require('../lib/data-source');

// Crear un material
async function crearMaterial(req, res) {
  try {
    const material = await repo('material').save(repo('material').create(req.body));
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Listar todos los materiales
async function listarMateriales(req, res) {
  try {
    const materiales = await repo('material').find();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Ver un material por id
async function obtenerMaterial(req, res) {
  try {
    const material = await repo('material').findOneBy({ id: req.params.id });
    if (!material) return res.status(404).json({ error: 'Material no encontrado' });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Editar un material
async function editarMaterial(req, res) {
  try {
    if (!(await repo('material').existsBy({ id: req.params.id }))) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
    await repo('material').update({ id: req.params.id }, req.body);
    res.json(await repo('material').findOneBy({ id: req.params.id }));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminar un material
async function eliminarMaterial(req, res) {
  try {
    const { affected } = await repo('material').delete({ id: req.params.id });
    if (!affected) return res.status(404).json({ error: 'Material no encontrado' });
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