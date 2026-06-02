const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comentario = sequelize.define('Comentario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adjuntos: {
        type: DataTypes.TEXT, // Storing as JSON string or simple path
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
    tableName: 'comentarios',
    timestamps: true
});

module.exports = Comentario;
