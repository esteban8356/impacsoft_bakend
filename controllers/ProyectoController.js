const Proyecto = require('../models/Proyecto');
const Fase = require('../models/Fase');
const Tarea = require('../models/Tarea');
const Cliente = require('../models/Cliente');
const User = require('../models/User');

// Get all projects
exports.getProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll({
            include: [
                { model: Cliente, attributes: ['id', 'nombre'] },
                { model: User, as: 'responsable', attributes: ['id', 'username'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: proyectos });
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Get project by ID with full details
exports.getProyectoById = async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await Proyecto.findByPk(id, {
            include: [
                { model: Cliente },
                { model: User, as: 'responsable', attributes: ['id', 'username'] },
                {
                    model: Fase,
                    include: [{ model: Tarea }]
                },
                {
                    model: Tarea,
                    include: [{ model: User, as: 'asignado', attributes: ['id', 'username'] }]
                }
            ]
        });

        if (!proyecto) {
            return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        }

        res.status(200).json({ success: true, data: proyecto });
    } catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// Create new project
exports.createProyecto = async (req, res) => {
    try {
        const nuevoProyecto = await Proyecto.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Proyecto creado exitosamente',
            data: nuevoProyecto
        });
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el proyecto.',
            error: error.message
        });
    }
};

// Update project
exports.updateProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Proyecto.update(req.body, { where: { id } });

        if (updated) {
            const proyectoActualizado = await Proyecto.findByPk(id);
            res.status(200).json({
                success: true,
                message: 'Proyecto actualizado',
                data: proyectoActualizado
            });
        } else {
            res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// Delete project
exports.deleteProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Proyecto.destroy({ where: { id } });

        if (deleted) {
            res.status(200).json({ success: true, message: 'Proyecto eliminado.' });
        } else {
            res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// ===== FASES =====

// Get fases of a project
exports.getFasesByProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const fases = await Fase.findAll({
            where: { proyectoId: id },
            order: [['orden', 'ASC']]
        });
        res.status(200).json({ success: true, data: fases });
    } catch (error) {
        console.error('Error al obtener fases:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// Create fase
exports.createFase = async (req, res) => {
    try {
        const { id } = req.params;
        const nuevaFase = await Fase.create({ ...req.body, proyectoId: id });
        res.status(201).json({
            success: true,
            message: 'Fase creada exitosamente',
            data: nuevaFase
        });
    } catch (error) {
        console.error('Error al crear fase:', error);
        res.status(500).json({ success: false, message: 'Error al crear la fase.' });
    }
};

// Update fase
exports.updateFase = async (req, res) => {
    try {
        const { faseId } = req.params;
        const [updated] = await Fase.update(req.body, { where: { id: faseId } });

        if (updated) {
            const faseActualizada = await Fase.findByPk(faseId);
            res.status(200).json({ success: true, data: faseActualizada });
        } else {
            res.status(404).json({ success: false, message: 'Fase no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar fase:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// Delete fase
exports.deleteFase = async (req, res) => {
    try {
        const { faseId } = req.params;
        const deleted = await Fase.destroy({ where: { id: faseId } });

        if (deleted) {
            res.status(200).json({ success: true, message: 'Fase eliminada.' });
        } else {
            res.status(404).json({ success: false, message: 'Fase no encontrada.' });
        }
    } catch (error) {
        console.error('Error al eliminar fase:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// ===== TAREAS =====

// Get tareas of a project
exports.getTareasByProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const tareas = await Tarea.findAll({
            where: { proyectoId: id },
            include: [
                { model: User, as: 'asignado', attributes: ['id', 'username'] },
                { model: Fase, attributes: ['id', 'nombre'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: tareas });
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// Create tarea
exports.createTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const nuevaTarea = await Tarea.create({ ...req.body, proyectoId: id });
        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: nuevaTarea
        });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ success: false, message: 'Error al crear la tarea.' });
    }
};

// Update tarea
exports.updateTarea = async (req, res) => {
    try {
        const { tareaId } = req.params;
        const [updated] = await Tarea.update(req.body, { where: { id: tareaId } });

        if (updated) {
            const tareaActualizada = await Tarea.findByPk(tareaId);
            res.status(200).json({ success: true, data: tareaActualizada });
        } else {
            res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// Delete tarea
exports.deleteTarea = async (req, res) => {
    try {
        const { tareaId } = req.params;
        const deleted = await Tarea.destroy({ where: { id: tareaId } });

        if (deleted) {
            res.status(200).json({ success: true, message: 'Tarea eliminada.' });
        } else {
            res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};
