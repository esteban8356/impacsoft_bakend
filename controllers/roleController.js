const Role = require('../models/Role');

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({ data: roles });
    } catch (error) {
        console.error('Error getting roles:', error);
        res.status(500).json({ message: 'Error retrieving roles' });
    }
};

exports.createRole = async (req, res) => {
    try {
        const { name, modules } = req.body;
        if (!name) return res.status(400).json({ message: 'Role name is required' });

        const [role, created] = await Role.findOrCreate({
            where: { name },
            defaults: { modules: modules || [] }
        });

        if (!created) {
            return res.status(409).json({ message: 'Role already exists' });
        }

        res.status(201).json({ message: 'Role created', data: role });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Error creating role' });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { name } = req.params;
        const { modules } = req.body;

        const role = await Role.findByPk(name);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        role.modules = modules;
        await role.save();

        res.status(200).json({ message: 'Role updated', data: role });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Error updating role' });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const { name } = req.params;
        if (name === 'administrador') return res.status(403).json({ message: 'Cannot delete admin role' });

        const role = await Role.findByPk(name);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        await role.destroy();
        res.status(200).json({ message: 'Role deleted' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ message: 'Error deleting role' });
    }
};
