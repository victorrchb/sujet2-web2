const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('POST /api/auth/register', () => {
    test('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@test.com');
    });

    test('should not create a user with existing email', async () => {
      await User.create({
        username: 'existing',
        email: 'test@test.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123'
        });
    });

    test('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});