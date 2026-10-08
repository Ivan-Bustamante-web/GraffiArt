const prisma = require('../lib/prisma');

async function listarCategorias(req, res) {
  try {
    const categorias = await prisma.categoriaProducto.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: { productos: true },
        },
      },
    });

    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearCategoria(req, res) {
  try {
    const { nombre, descripcion } = req.body || {};
    const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';

    if (!nombreLimpio) {
      return res.status(400).json({
        error: 'El nombre de la categoría es obligatorio',
      });
    }

    const categoria = await prisma.categoriaProducto.create({
      data: {
        nombre: nombreLimpio,
        descripcion:
          typeof descripcion === 'string' && descripcion.trim()
            ? descripcion.trim()
            : null,
      },
    });

    res.status(201).json(categoria);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Ya existe una categoría con ese nombre',
      });
    }

    res.status(500).json({ error: error.message });
  }
}

async function editarCategoria(req, res) {
  try {
    const { nombre, descripcion, activo } = req.body || {};
    const data = {};

    if (nombre !== undefined) {
      const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
      if (!nombreLimpio) {
        return res.status(400).json({
          error: 'El nombre de la categoría es obligatorio',
        });
      }
      data.nombre = nombreLimpio;
    }

    if (descripcion !== undefined) {
      data.descripcion =
        typeof descripcion === 'string' && descripcion.trim()
          ? descripcion.trim()
          : null;
    }

    if (activo !== undefined) {
      data.activo = Boolean(activo);
    }

    const categoria = await prisma.categoriaProducto.update({
      where: { id: req.params.id },
      data,
      include: {
        _count: {
          select: { productos: true },
        },
      },
    });

    res.json(categoria);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Ya existe una categoría con ese nombre',
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(400).json({ error: error.message });
  }
}

async function eliminarCategoria(req, res) {
  try {
    await prisma.categoriaProducto.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  listarCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
};
