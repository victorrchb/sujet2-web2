const { Sequelize } = require('sequelize');
const sequelize = require('../config/db'); 

// Définition du modèle User
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Définition du modèle Project
const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  projectManager: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tasksCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

// Relations
User.hasMany(Project);
Project.belongsTo(User);

// Synchronisation avec la base de données
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch(err => {
    console.error('Erreur de synchronisation:', err);
  });

module.exports = {
  User,
  Project,
  sequelize
};