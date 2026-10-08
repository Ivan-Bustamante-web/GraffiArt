const prisma = require('../lib/prisma');

// Obtener todos los gabinetes activos
async function obtenerGabinetes(req, res) {
    try {
        const gabinetes = await prisma.gabinete.findMany({
            where: { activo: true }
        });

        // Convertir los campos Decimal a número para evitar problemas de serialización en JSON
        const gabinetesMapeados = gabinetes.map(gab => ({
            ...gab,
            costoUnitario: Number(gab.costoUnitario)
        }));

        return res.status(200).json(gabinetesMapeados);
    } catch (error) {
        console.error("Error al obtener gabinetes:", error);
        return res.status(500).json({ error: 'Error al obtener los gabinetes' });
    }
}

// Obtener un gabinete específico por su ID
async function obtenerGabinetePorId(req, res) {
    try {
        const { id } = req.params;
        const gabinete = await prisma.gabinete.findUnique({
            where: { id }
        });

        if (!gabinete || !gabinete.activo) {
            return res.status(404).json({ error: 'Gabinete no encontrado' });
        }

        // Convertir Decimal a número por seguridad
        const gabineteMapeado = {
            ...gabinete,
            costoUnitario: Number(gabinete.costoUnitario)
        };

        return res.status(200).json(gabineteMapeado);
    } catch (error) {
        console.error("Error al obtener el gabinete:", error);
        return res.status(500).json({ error: 'Error al obtener el gabinete' });
    }
}

module.exports = {
    obtenerGabinetes,
    obtenerGabinetePorId
};