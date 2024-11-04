const { sequelize } = require('../models');

beforeAll(async () => {
  try {
    // Désactive les logs SQL
    sequelize.options.logging = false;
    
    // Force la synchronisation des tables
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Setup error:', error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Teardown error:', error);
  }
});

// Affiche plus de détails sur les erreurs de test
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});