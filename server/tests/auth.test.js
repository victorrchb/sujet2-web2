const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Auth Routes', () => {
  beforeAll(async () => {
    await User.destroy({ where: {} }); // Nettoie la base de données
  });

  test('Should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('Should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});