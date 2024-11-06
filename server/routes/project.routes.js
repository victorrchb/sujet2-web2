const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const auth = require('../middleware/auth');

// Obtenir tous les projets
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { UserId: req.user.id }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
  }
});

// Obtenir un projet spécifique
router.get('/:id', auth, async (req, res) => {
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
    res.status(500).json({ message: 'Erreur lors de la récupération du projet' });
  }
});

// Créer un nouveau projet
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, projectManager } = req.body;

    if (!name || !projectManager) {
      return res.status(400).json({ message: 'Le nom et le chef de projet sont requis' });
    }

    const project = await Project.create({
      name,
      description,
      projectManager,
      UserId: req.user.id,
      tasksCount: 0
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du projet' });
  }
});

// Mettre à jour un projet
router.put('/:id', auth, async (req, res) => {
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

    const { name, description, projectManager } = req.body;
    
    if (name) project.name = name;
    if (description) project.description = description;
    if (projectManager) project.projectManager = projectManager;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du projet' });
  }
});

// Supprimer un projet
router.delete('/:id', auth, async (req, res) => {
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
    res.status(500).json({ message: 'Erreur lors de la suppression du projet' });
  }
});

// Incrémenter le nombre de tâches
router.post('/:id/tasks', auth, async (req, res) => {
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

    project.tasksCount += 1;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la tâche' });
  }
});

module.exports = router;