const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: console.log
  }
);

// Test de connexion
sequelize.authenticate()
  .then(() => console.log('Connexion à la base de données réussie'))
  .catch(err => console.error('Erreur de connexion à la base de données:', err));

const User = require('./User')(sequelize);
const Project = require('./Project')(sequelize);

User.hasMany(Project);
Project.belongsTo(User);

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
    .then(() => console.log('Tables synchronisées'))
    .catch(err => console.error('Erreur de synchronisation:', err));
}

module.exports = {
  sequelize,
  User,
  Project
};