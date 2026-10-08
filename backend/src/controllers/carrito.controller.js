const prisma =require('../lib/prisma');

async function actualizarCantidadItem(req, res){
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || parseInt(cantidad) <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0'});
    }

    const itemExistente = await prisma.itemcarrito.findFirst({
      where: {
        id,
        carrito: { usuarioId: req.usuario.id },
      },
    });

    if (!itemExistente) {
      return res.status(400).json({ error: 'Item no encontrado en el carrito'});
    }

    await prisma.itemcarrito.update({
      where: { id },
      data: { cantidad: parseInt(cantidad) },
    });

    const carritoActualizado = await prisma.carrito.findUnique({
      where: { usuarioId: req.usuario.id },
      include: {
        itemcarrito: {
          include: { gabinete: true, disenoguardado: true},
          orderBy: { createdAt: 'desc'},
        },
      },
    });

    res.json(calcularTotalesCarrito(carritoActualizado));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarItem(req, res) {
  try {
    const { id } = req.params;

    const itemExistente = await prisma.itemcarrito.findFirst({
      where: {
        id,
        carrito: { usuarioId: req.usuario.id },
      },
    });

    if (!itemExistente) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito'});
    }

    await prisma.itemcarrito.delete({
      where: { id },
    });

    const carritoActualizado = await prisma.carrito.findUnique({
      where: { usuarioId: req.usuario.id },
      include: {
        itemcarrito: {
          include: { gabinete: true, disenoguardado: true},
          orderBy: { createdAt: 'desc'},
        },
      },
    });

    res.json(calcularTotalesCarrito(carritoActualizado));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


function calcularTotalesCarrito(carrito) {
    if (!carrito || !carrito.itemcarrito) return { ...carrito, items: [], total: 0};

    const itemsConSubtotal = carrito.itemcarrito.map( item => {
        const subtotal = Number(item.precioUnitario) * item.cantidad;
        return {
            ...item,
            subtotal,
        };
    });

    const total = itemsConSubtotal.reduce((acc, item) => acc + item.subtotal, 0);
    return {
        ...carrito,
        items: itemsConSubtotal,
        total,
    };
}


async function obtenerCarrito(req, res) {
    try {
        let carrito = await prisma.carrito.findUnique({
            where: { usuarioId: req.usuario.id },
            include: {
                itemcarrito: {
                    include: {
                        gabinete: true,
                        disenoguardado: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!carrito) {
            carrito = await prisma.carrito.create({
                data: { usuarioId: req.usuario.id, updatedAt: new Date() },
                include: {
                    itemcarrito: {
                        include: {
                            gabinete: true,
                            disenoguardado: true,
                        },
                    },
                },
            });
        }

        const carritoConTotales = calcularTotalesCarrito(carrito);
        res.json(carritoConTotales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function agregarItem(req, res) {
    try {
        const { gabineteId, disenoGuardadoId, cantidad = 1 } = req.body;

        if (!gabineteId && !disenoGuardadoId) {
            return res.status(400).json({ error: 'No se especificó ningún producto o diseño para agregar al carrito.'})
        }

        let precioUnitario = 0;
        let gabinete = null;
        let diseno = null;

        if (gabineteId) {
          gabinete= await prisma.gabinete.findUnique({
            where: { id: gabineteId },
          });

      if (!gabinete || !gabinete.activo) {
        return res.status(404).json({ error: 'El gabinete seleccionado no está disponible' });
      }
      precioUnitario += Number(gabinete.costoUnitario);
    }

    if (disenoGuardadoId) {
      diseno = await prisma.disenoguardado.findFirst({
        where: { id: disenoGuardadoId, usuarioId: req.usuario.id },
      });

      if (!diseno) {
        return res.status(404).json({ error: 'El diseño guardado no fue encontrado' });
      }
      const costoDiseno = 0; //Modificar aca el costo de diseño para sumar al total
      precioUnitario += costoDiseno; 
    }

    //Verifica si el usuario tiene un carrito activo
    let carrito = await prisma.carrito.findUnique({
      where: { usuarioId: req.usuario.id },
    });

    if (!carrito) {
      carrito = await prisma.carrito.create({
        data: { usuarioId: req.usuario.id, updatedAt: new Date() },
      });
    }

    //Verifica si el item ya existe en el carrito para sumar la cantidad o crearlo
    const itemExistente = await prisma.itemcarrito.findFirst({
      where: {
        carritoId: carrito.id,
        ...(gabineteId ? { gabineteId } : { disenoGuardadoId }),
      },
    });

    const cantidadAEnviar = parseInt(cantidad) > 0 ? parseInt(cantidad) : 1;

    if (itemExistente) {
      await prisma.itemcarrito.update({
        where: { id: itemExistente.id },
        data: { cantidad: itemExistente.cantidad + cantidadAEnviar },
      });
    } else {
      await prisma.itemcarrito.create({
        data: {
          carritoId: carrito.id,
          gabineteId: gabineteId || null,
          disenoGuardadoId: disenoGuardadoId || null,
          cantidad: cantidadAEnviar,
          precioUnitario,
          updatedAt: new Date(),
        },
      });
    }

    // Devolver el carrito completo y actualizado con sus subtotales y totales calculados
    const carritoActualizado = await prisma.carrito.findUnique({
      where: { id: carrito.id },
      include: {
        itemcarrito: {
          include: {
            gabinete: true,
            disenoguardado: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const resultadoFinal = calcularTotalesCarrito(carritoActualizado);
    res.status(201).json(resultadoFinal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    obtenerCarrito,
    agregarItem,
    actualizarCantidadItem,
    eliminarItem,
};