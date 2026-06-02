const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'createdAt'] // Don't return passwords
        });
        res.status(200).json({ data: users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate if user exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return res.status(409).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
            role: role || 'client'
        });

        res.status(201).json({ message: 'User created', data: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (role) user.role = role;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.status(200).json({ message: 'User updated', data: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent deleting self or specific admin check could go here if we had current user context easily
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.username === 'admin') return res.status(403).json({ message: 'Cannot delete default admin' });

        await user.destroy();
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
