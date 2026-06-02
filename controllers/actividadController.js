const Actividad = require('../models/Actividad');

exports.getActividadesByCaso = async (req, res) => {
    try {
        const { id } = req.params; // case id
        const actividades = await Actividad.findAll({
            where: { casoId: id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ data: actividades });
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};

exports.createActividad = async (req, res) => {
    try {
        const { id } = req.params; // case id
        const { titulo, descripcion, estado } = req.body;

        const newActividad = await Actividad.create({
            casoId: id,
            titulo,
            descripcion,
            estado: estado || 'Programada'
        });

        res.status(201).json({ message: 'Actividad creada', data: newActividad });
    } catch (error) {
        console.error('Error al crear actividad:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};

exports.updateActividad = async (req, res) => {
    try {
        const { id, actividadId } = req.params;
        const { estado } = req.body;

        const actividad = await Actividad.findOne({ where: { id: actividadId, casoId: id } });

        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada' });
        }

        actividad.estado = estado;
        await actividad.save();

        res.status(200).json({ message: 'Estado actualizado', data: actividad });
    } catch (error) {
        console.error('Error al actualizar actividad:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};

exports.deleteActividad = async (req, res) => {
    try {
        const { id, actividadId } = req.params;
        await Actividad.destroy({ where: { id: actividadId, casoId: id } });
        res.status(200).json({ message: 'Actividad eliminada' });
    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};
