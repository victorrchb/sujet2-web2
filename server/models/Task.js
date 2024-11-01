const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Project = require('./Project');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
});

Task.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Task, { foreignKey: 'projectId' });

module.exports = Task;
