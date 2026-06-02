const Caso = require('../models/Caso');
const Solicitud = require('../models/Solicitud');
const Cliente = require('../models/Cliente');

// Get all cases
exports.getCases = async (req, res) => {
    try {
        const casos = await Caso.findAll({
            include: [
                { model: Cliente, attributes: ['id', 'nombre', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ data: casos });
    } catch (error) {
        console.error('Error al obtener casos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Get case by ID
exports.getCasoById = async (req, res) => {
    try {
        const { id } = req.params;
        const caso = await Caso.findByPk(id);
        if (!caso) return res.status(404).json({ message: 'Caso no encontrado' });
        res.status(200).json({ data: caso });
    } catch (error) {
        console.error('Error al obtener caso:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};

// Update case
exports.updateCaso = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Caso.update(req.body, { where: { id } });
        if (updated) {
            const updatedCaso = await Caso.findByPk(id);
            res.status(200).json({ message: 'Caso actualizado', data: updatedCaso });
        } else {
            res.status(404).json({ message: 'Caso no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar caso:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
};

// Create a case from a request (Promote)
exports.createCaso = async (req, res) => {
    const { requestId, ...casoData } = req.body;

    // Start a transaction Ideally, but for simplicity here:
    try {
        // 1. Create the case
        const newCaso = await Caso.create(casoData);

        // 2. Delete the original request if requestId is provided
        if (requestId) {
            await Solicitud.destroy({ where: { id: requestId } });
        }

        res.status(201).json({ message: 'Caso creado exitosamente y solicitud eliminada.', data: newCaso });
    } catch (error) {
        console.error('Error al crear caso:', error);
        res.status(500).json({ message: 'Error al crear el caso.' });
    }
};

// Delete a case
exports.deleteCase = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Caso.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: 'Caso eliminado.' });
        } else {
            res.status(404).json({ message: 'Caso no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar caso:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
