const Caso = require('../models/Caso');
const User = require('../models/User');
const Solicitud = require('../models/Solicitud');
const { Op, Sequelize } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);

        // 1. Total Counts
        const totalCasos = await Caso.count();
        const totalSolicitudes = await Solicitud.count();

        // 2. Casos por Estado (Pie Chart)
        const casosPorEstado = await Caso.findAll({
            attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
            group: ['status']
        });

        // 3. Casos por Usuario Asignado (Pie Chart - maybe kept for data but not primary layout)
        const casosPorUsuario = await Caso.findAll({
            attributes: ['assignedUserId', [Sequelize.fn('COUNT', Sequelize.col('Caso.id')), 'count']],
            include: [{ model: User, as: 'assignedUser', attributes: ['username'] }],
            group: ['assignedUserId', 'assignedUser.id', 'assignedUser.username']
        });

        // 4. Monthly Stats (Cases vs Requests)
        const casosPorMes = await Caso.findAll({
            attributes: [
                [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', 'id'), 'count']
            ],
            where: { createdAt: { [Op.gte]: sixMonthsAgo } },
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'ASC']]
        });

        const solicitudesPorMes = await Solicitud.findAll({
            attributes: [
                [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', 'id'), 'count']
            ],
            where: { createdAt: { [Op.gte]: sixMonthsAgo } },
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'ASC']]
        });

        // 5. Recent Lists (Last 10)
        const lastCasos = await Caso.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'assignedUser', attributes: ['username'] }]
        });

        const lastSolicitudes = await Solicitud.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                totalCasos,
                totalSolicitudes,
                casosPorEstado,
                casosPorUsuario,
                casosPorMes,
                solicitudesPorMes,
                lastCasos,
                lastSolicitudes
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};
