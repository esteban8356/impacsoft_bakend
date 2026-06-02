const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proyecto = sequelize.define('Proyecto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fechaFinEstimada: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fechaFinReal: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Planificación', 'En Progreso', 'En Pausa', 'Completado', 'Cancelado'),
        defaultValue: 'Planificación'
    },
    presupuestoEstimado: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true
    },
    presupuestoReal: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
    },
    moneda: {
        type: DataTypes.STRING(10),
        defaultValue: 'COP'
    },
    prioridad: {
        type: DataTypes.ENUM('Baja', 'Media', 'Alta', 'Crítica'),
        defaultValue: 'Media'
    },
    responsableId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    progreso: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    repositorio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    documentacion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notas: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'proyectos',
    timestamps: true
});

module.exports = Proyecto;
