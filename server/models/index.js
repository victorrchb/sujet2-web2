const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: process.env.NODE_ENV === 'test' ? false : console.log
  }
);

const User = require('./user')(sequelize);
const Project = require('./project')(sequelize);

User.hasMany(Project);
Project.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Project
};