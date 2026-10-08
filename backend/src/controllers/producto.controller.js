const prisma = require('../lib/prisma');

async function listarProductos(req, res) {
  try {
    const productos = await prisma.gabinete.findMany({
      include: { categoria: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerProducto(req, res) {
  try {
    const producto = await prisma.gabinete.findUnique({
      where: { id: req.params.id },
      include: { categoria: true },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function validarDatosProducto(body) {
  const {
    nombre,
    marca,
    costoUnitario,
    stockActual,
    stockMinimo,
    tamano,
    formato,
    materialChasis,
    panel,
  } = body;

  if (!nombre?.trim() || !marca?.trim()) {
    return 'Nombre y marca son obligatorios';
  }

  if (costoUnitario === undefined || Number.isNaN(Number(costoUnitario)) || Number(costoUnitario) < 0) {
    return 'El costo unitario debe ser un número mayor o igual a 0';
  }

  if (stockActual === undefined || Number.isNaN(Number(stockActual)) || Number(stockActual) < 0) {
    return 'El stock actual debe ser un número mayor o igual a 0';
  }

  if (stockMinimo === undefined || Number.isNaN(Number(stockMinimo)) || Number(stockMinimo) < 0) {
    return 'El stock mínimo debe ser un número mayor o igual a 0';
  }

  if (!tamano || !formato || !materialChasis || !panel) {
    return 'Las características del gabinete son obligatorias';
  }

  return null;
}

async function crearProducto(req, res) {
  try {
    const errorValidacion = validarDatosProducto(req.body || {});
    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const {
      nombre,
      marca,
      costoUnitario,
      stockActual,
      stockMinimo,
      tamano,
      formato,
      materialChasis,
      panel,
      categoriaId,
    } = req.body;

    if (categoriaId) {
      const categoria = await prisma.categoriaProducto.findUnique({
        where: { id: categoriaId },
      });
      if (!categoria) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
      }
    }

    const producto = await prisma.gabinete.create({
      data: {
        nombre: nombre.trim(),
        marca: marca.trim(),
        costoUnitario: Number(costoUnitario),
        stockActual: Number(stockActual),
        stockMinimo: Number(stockMinimo),
        tamano,
        formato,
        materialChasis,
        panel,
        categoriaId: categoriaId || null,
      },
      include: { categoria: true },
    });

    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function editarProducto(req, res) {
  try {
    const body = req.body || {};
    const data = {};

    if (body.nombre !== undefined) data.nombre = body.nombre.trim();
    if (body.marca !== undefined) data.marca = body.marca.trim();
    if (body.costoUnitario !== undefined) data.costoUnitario = Number(body.costoUnitario);
    if (body.stockActual !== undefined) data.stockActual = Number(body.stockActual);
    if (body.stockMinimo !== undefined) data.stockMinimo = Number(body.stockMinimo);
    if (body.tamano !== undefined) data.tamano = body.tamano;
    if (body.formato !== undefined) data.formato = body.formato;
    if (body.materialChasis !== undefined) data.materialChasis = body.materialChasis;
    if (body.panel !== undefined) data.panel = body.panel;
    if (body.categoriaId !== undefined) data.categoriaId = body.categoriaId || null;
    if (body.activo !== undefined) data.activo = Boolean(body.activo);

    if (data.nombre !== undefined && !data.nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    if (data.marca !== undefined && !data.marca) {
      return res.status(400).json({ error: 'La marca es obligatoria' });
    }
    if (data.costoUnitario !== undefined && (Number.isNaN(data.costoUnitario) || data.costoUnitario < 0)) {
      return res.status(400).json({ error: 'El costo unitario no es válido' });
    }
    if (data.stockActual !== undefined && (Number.isNaN(data.stockActual) || data.stockActual < 0)) {
      return res.status(400).json({ error: 'El stock actual no es válido' });
    }
    if (data.stockMinimo !== undefined && (Number.isNaN(data.stockMinimo) || data.stockMinimo < 0)) {
      return res.status(400).json({ error: 'El stock mínimo no es válido' });
    }

    if (data.categoriaId) {
      const categoria = await prisma.categoriaProducto.findUnique({
        where: { id: data.categoriaId },
      });
      if (!categoria) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
      }
    }

    const producto = await prisma.gabinete.update({
      where: { id: req.params.id },
      data,
      include: { categoria: true },
    });

    res.json(producto);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(400).json({ error: error.message });
  }
}

async function eliminarProducto(req, res) {
  try {
    await prisma.gabinete.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  editarProducto,
  eliminarProducto,
};
