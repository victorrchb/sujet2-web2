const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    projectManager: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tasksCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  return Project;
};