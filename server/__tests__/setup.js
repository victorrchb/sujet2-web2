const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('database connection', () => {
  expect(sequelize).toBeDefined();
});