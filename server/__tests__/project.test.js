const request = require('supertest');
const app = require('../app');
const { User, Project } = require('../models');
const jwt = require('jsonwebtoken');

describe('Project Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Nettoyer la base de données
    await Project.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Créer un utilisateur test
    const user = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });
    userId = user.id;
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key');
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

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Project');
      expect(res.body).toHaveProperty('userId', userId);
    });

    it('should not create project without auth', async () => {
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
    it('should get all projects for user', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('PUT /api/projects/:id', () => {
    let projectId;

    beforeAll(async () => {
      const project = await Project.create({
        name: 'Update Test',
        description: 'To be updated',
        projectManager: 'Manager',
        userId
      });
      projectId = project.id;
    });

    it('should update a project', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Project',
          description: 'Updated Description',
          projectManager: 'Updated Manager'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Project');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    let projectId;

    beforeAll(async () => {
      const project = await Project.create({
        name: 'To Delete',
        description: 'Will be deleted',
        projectManager: 'Manager',
        userId
      });
      projectId = project.id;
    });

    it('should delete a project', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      // Vérifier que le projet est bien supprimé
      const deletedProject = await Project.findByPk(projectId);
      expect(deletedProject).toBeNull();
    });
  });
});