const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fase = sequelize.define('Fase', {
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
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'En Progreso', 'Completada'),
        defaultValue: 'Pendiente'
    },
    orden: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    tableName: 'fases',
    timestamps: true
});

module.exports = Fase;
