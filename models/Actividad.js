const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Actividad = sequelize.define('Actividad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Programada', 'Hecha', 'Finalizada'),
        defaultValue: 'Programada',
        allowNull: false
    },
    casoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'casos',
            key: 'id'
        }
    }
}, {
    tableName: 'actividades',
    timestamps: true
});

module.exports = Actividad;
