const prisma = require('../lib/prisma');

async function listarDisenos(req, res) {
  try {
    const disenos = await prisma.disenoguardado.findMany({
      where: { usuarioId: req.usuario.id },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(disenos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearDiseno(req, res) {
  try {
    const { nombre, descripcion, configuracion } = req.body;

    if (!nombre || !configuracion) {
      return res.status(400).json({ error: 'Nombre y configuración son obligatorios' });
    }

    const diseno = await prisma.disenoguardado.create({
      data: {
        nombre,
        descripcion: descripcion || '',
        configuracion,
        usuarioId: req.usuario.id,
      },
    });

    res.status(201).json(diseno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizarDiseno(req, res) {
  try {
    const { nombre, descripcion, configuracion } = req.body;

    const existente = await prisma.disenoguardado.findFirst({
      where: { id: req.params.id, usuarioId: req.usuario.id },
    });

    if (!existente) {
      return res.status(404).json({ error: 'Diseño no encontrado' });
    }

    const diseno = await prisma.disenoguardado.update({
      where: { id: req.params.id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(configuracion !== undefined && { configuracion }),
      },
    });

    res.json(diseno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarDiseno(req, res) {
  try {
    const existente = await prisma.disenoguardado.findFirst({
      where: { id: req.params.id, usuarioId: req.usuario.id },
    });

    if (!existente) {
      return res.status(404).json({ error: 'Diseño no encontrado' });
    }

    await prisma.disenoguardado.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  listarDisenos,
  crearDiseno,
  actualizarDiseno,
  eliminarDiseno,
};
