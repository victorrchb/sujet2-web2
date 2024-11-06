const app = require('../app');
const db = require('../models');

let server;

beforeAll(async () => {
  server = await new Promise(resolve => {
    server = app.listen(0, () => {
      resolve(server);
    });
  });
  await db.sequelize.sync();
});

afterAll(async () => {
  await db.sequelize.close();
  await new Promise(resolve => server.close(resolve));
});

module.exports = { server };