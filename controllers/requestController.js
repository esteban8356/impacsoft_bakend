const Solicitud = require('../models/Solicitud');

exports.createSolicitud = async (req, res) => {
    try {
        const { nombre, email, telefono, empresa, mensaje } = req.body;

        // "todos los campos sean obligatorios"
        if (!nombre || !email || !telefono || !empresa || !mensaje) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const nuevaSolicitud = await Solicitud.create({
            nombre,
            email,
            telefono,
            empresa,
            mensaje
        });

        res.status(201).json({
            message: 'Solicitud enviada correctamente.',
            data: nuevaSolicitud
        });
    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.getSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ data: solicitudes });
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.deleteSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await Solicitud.findByPk(id);

        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }

        await solicitud.destroy();
        res.status(200).json({ message: 'Solicitud eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
