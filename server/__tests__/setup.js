const { sequelize } = require('../models');
require('dotenv').config({ path: '.env.test' });

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Test database connected');
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Test database connection error:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await sequelize.truncate({ cascade: true });
});