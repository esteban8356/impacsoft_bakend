const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tarea = sequelize.define('Tarea', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    proyectoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'proyectos',
            key: 'id'
        }
    },
    faseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'fases',
            key: 'id'
        }
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    asignadoA: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'En Progreso', 'En Revisión', 'Completada'),
        defaultValue: 'Pendiente'
    },
    prioridad: {
        type: DataTypes.ENUM('Baja', 'Media', 'Alta'),
        defaultValue: 'Media'
    },
    horasEstimadas: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true
    },
    horasReales: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
        defaultValue: 0
    },
    fechaVencimiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    etiquetas: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
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
    tableName: 'tareas',
    timestamps: true
});

module.exports = Tarea;
