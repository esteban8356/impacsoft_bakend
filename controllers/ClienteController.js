const Cliente = require('../models/Cliente');

// Get all clients
exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            order: [['nombre', 'ASC']],
            where: { activo: true }
        });
        res.status(200).json({ success: true, data: clientes });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Get client by ID
exports.getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }

        res.status(200).json({ success: true, data: cliente });
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// Create new client
exports.createCliente = async (req, res) => {
    try {
        const nuevoCliente = await Cliente.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            data: nuevoCliente
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el cliente.',
            error: error.message
        });
    }
};

// Update client
exports.updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Cliente.update(req.body, { where: { id } });

        if (updated) {
            const clienteActualizado = await Cliente.findByPk(id);
            res.status(200).json({
                success: true,
                message: 'Cliente actualizado',
                data: clienteActualizado
            });
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// Soft delete client (set activo = false)
exports.deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Cliente.update({ activo: false }, { where: { id } });

        if (updated) {
            res.status(200).json({ success: true, message: 'Cliente desactivado.' });
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
        }
    } catch (error) {
        console.error('Error al desactivar cliente:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Reactivate client
exports.reactivateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Cliente.update({ activo: true }, { where: { id } });

        if (updated) {
            res.status(200).json({ success: true, message: 'Cliente reactivado.' });
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
        }
    } catch (error) {
        console.error('Error al reactivar cliente:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};
