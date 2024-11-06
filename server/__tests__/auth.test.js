const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const bcrypt = require('bcrypt');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123'
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register user with existing email', async () => {
      await User.create({
        username: 'existinguser',
        email: 'test@test.com',
        password: await bcrypt.hash('password123', 10)
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123'
        });
      expect(res.status).toBe(400);
    });

    it('should not register user with invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: '',
          email: 'invalid-email',
          password: '123'
        });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        email: 'test@test.com',
        password: hashedPassword
      });
    });

    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123'
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });
      expect(res.status).toBe(401);
    });

    it('should not login non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Email ou mot de passe incorrect');
    });
  });
});