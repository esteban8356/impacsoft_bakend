const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    modules: {
        type: DataTypes.JSON, // Stores array of module names, e.g., ['home', 'requests', 'users', 'roles']
        allowNull: false,
        defaultValue: []
    }
});

module.exports = Role;
