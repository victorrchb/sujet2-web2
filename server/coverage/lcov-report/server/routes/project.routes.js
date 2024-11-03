const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const auth = require('../middleware/auth');

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      userId: req.user.id
    });
    
    const createdProject = await Project.findByPk(project.id);
    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: 'Erreur lors de la création du projet' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
    try {
      const project = await Project.findOne({
        where: { 
          id: req.params.id,
          userId: req.user.id 
        }
      });
  
      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
  
      await project.update(req.body);
      const updatedProject = await Project.findByPk(project.id);
      res.json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(400).json({ message: 'Erreur lors de la mise à jour du projet' });
    }
  });
  
  // Delete project
  router.delete('/:id', auth, async (req, res) => {
    try {
      const project = await Project.findOne({
        where: { 
          id: req.params.id,
          userId: req.user.id 
        }
      });
  
      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
  
      await project.destroy();
      res.json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  module.exports = router;