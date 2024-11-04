const request = require('supertest');
const app = require('../app');
const { User, Project } = require('../models');

describe('Project Routes', () => {
  let token;
  let projectId;
  let userId;

  beforeAll(async () => {
    await Project.destroy({ where: {} });
    await User.destroy({ where: {} });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@test.com`,
        password: 'password123'
      });

    token = response.body.token;
    userId = response.body.user.id;
  });

  test('Should create a project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'Test Description',
        projectManager: 'Test Manager',
        UserId: userId
      });

    projectId = response.body.id;
    expect(response.status).toBe(201);
  });

  test('Should update a project', async () => {
    const response = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Project',
        description: 'Updated Description',
        projectManager: 'Updated Manager',
        UserId: userId
      });

    expect(response.status).toBe(200);
  });

  test('Should get a specific project', async () => {
    const response = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', projectId);
    expect(response.body).toHaveProperty('name', 'Updated Project');
    expect(response.body).toHaveProperty('description', 'Updated Description');
    expect(response.body).toHaveProperty('projectManager', 'Updated Manager');
  });

  test('Should get all projects', async () => {
    // Créons un second projet pour tester la liste
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Second Project',
        description: 'Second Description',
        projectManager: 'Second Manager'
      });

    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('projectManager');
  });

  test('Should not create a project without authentication', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({
        name: 'Test Project',
        description: 'Test Description',
        projectManager: 'Test Manager'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Token manquant');
  });

  test('Should return 404 when getting non-existent project', async () => {
    const response = await request(app)
      .get('/api/projects/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Project not found');
  });

  test('Should return 404 when updating non-existent project', async () => {
    const response = await request(app)
      .put('/api/projects/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Project',
        description: 'Updated Description',
        projectManager: 'Updated Manager'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Project not found');
  });

  test('Should delete a project', async () => {
    const response = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    const checkProject = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(checkProject.status).toBe(404);
  });
});