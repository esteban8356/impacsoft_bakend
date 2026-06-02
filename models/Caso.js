const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Caso = sequelize.define('Caso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Abierto' // 'Abierto', 'En Proceso', 'Cerrado'
    },
    assignedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'clientes',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_inicio_proyecto: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    fecha_estimada_finalizacion: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'casos',
    timestamps: true
});

module.exports = Caso;
