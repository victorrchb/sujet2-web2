const request = require('supertest');
const app = require('../app');
const { User, Project } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Project Routes', () => {
  let token;
  let user;

  beforeEach(async () => {
    await Project.destroy({ where: {} });
    await User.destroy({ where: {} });

    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: hashedPassword
    });

    token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret'
    );
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Project',
          description: 'Test Description',
          projectManager: 'Test Manager'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Project');
      expect(res.body).toHaveProperty('UserId', user.id);
    });

    it('should not create project without required fields', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test Description'
        });

      expect(res.status).toBe(400);
    });

    it('should not create project without auth', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          description: 'Test Description',
          projectManager: 'Test Manager'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/projects', () => {
    it('should get all user projects', async () => {
      await Project.create({
        name: 'Test Project',
        description: 'Test Description',
        projectManager: 'Test Manager',
        UserId: user.id
      });

      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it('should not get projects without auth', async () => {
      const res = await request(app)
        .get('/api/projects');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update project', async () => {
      const project = await Project.create({
        name: 'Test Project',
        description: 'Test Description',
        projectManager: 'Test Manager',
        UserId: user.id
      });

      const res = await request(app)
        .put(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Project'
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Project');
    });

    it('should not update other user project', async () => {
      const otherUser = await User.create({
        username: 'other',
        email: 'other@test.com',
        password: await bcrypt.hash('password123', 10)
      });

      const project = await Project.create({
        name: 'Test Project',
        description: 'Test Description',
        projectManager: 'Test Manager',
        UserId: otherUser.id
      });

      const res = await request(app)
        .put(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Project'
        });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete project', async () => {
      const project = await Project.create({
        name: 'Test Project',
        description: 'Test Description',
        projectManager: 'Test Manager',
        UserId: user.id
      });

      const res = await request(app)
        .delete(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });
  });

  describe('POST /api/projects/:id/tasks', () => {
    it('should increment tasks count', async () => {
      const project = await Project.create({
        name: 'Test Project',
        description: 'Test Description',
        projectManager: 'Test Manager',
        UserId: user.id,
        tasksCount: 0
      });

      const res = await request(app)
        .post(`/api/projects/${project.id}/tasks`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tasksCount).toBe(1);
    });
  });
});