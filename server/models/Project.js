const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Project = sequelize.define('Project', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
});

Project.belongsTo(User, { foreignKey: 'ownerId' });
User.hasMany(Project, { foreignKey: 'ownerId' });

module.exports = Project;
