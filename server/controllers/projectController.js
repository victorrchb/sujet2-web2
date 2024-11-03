const { Project } = require('../models');

const projectController = {
  async getAllProjects(req, res) {
    try {
      const projects = await Project.findAll({
        where: { UserId: req.user.id }
      });
      res.json(projects);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async getProjectById(req, res) {
    try {
      const project = await Project.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id
        }
      });
      
      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
      
      res.json(project);
    } catch (error) {
      console.error('Erreur lors de la récupération du projet:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async createProject(req, res) {
    try {
      const project = await Project.create({
        ...req.body,
        UserId: req.user.id
      });
      res.status(201).json(project);
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async updateProject(req, res) {
    try {
      const project = await Project.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id
        }
      });

      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }

      await project.update(req.body);
      res.json(project);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async deleteProject(req, res) {
    try {
      const project = await Project.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id
        }
      });

      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }

      await project.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = projectController;