const request = require('supertest');
const app = require('../app');
const { User, Project } = require('../models');

let token;
let userId;
let projectId;

beforeAll(async () => {
  await User.destroy({ where: {} });
  
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });
  
  if (response.body && response.body.user) {
    userId = response.body.user.id;
    token = response.body.token;
  } else {
    throw new Error('Failed to create test user');
  }
});

describe('Project Endpoints', () => {
  beforeEach(async () => {
    await Project.destroy({ where: {} });
    
    const project = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'Test Description',
        projectManager: 'Test Manager'
      });
    
    projectId = project.body.id;
  });

  describe('POST /api/projects', () => {
    test('should create a new project', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Another Test Project',
          description: 'Test Description',
          projectManager: 'Test Manager'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('UserId', userId);
    });

    test('should not create project without auth', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          description: 'Test Description',
          projectManager: 'Test Manager'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/projects', () => {
    test('should get all projects for user', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('PUT /api/projects/:id', () => {
    test('should update a project', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Project'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Project');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    test('should delete a project', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      const deletedProject = await Project.findByPk(projectId);
      expect(deletedProject).toBeNull();
    });
  });
});