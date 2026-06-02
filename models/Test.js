const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Test = sequelize.define('Test', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resultado: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    adjuntos: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'tests',
    timestamps: true
});

module.exports = Test;
