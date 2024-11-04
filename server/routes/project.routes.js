const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      UserId: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await project.update(req.body);
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
      const projects = await Project.findAll({
        where: { 
          UserId: req.user.id
        },
        order: [['createdAt', 'DESC']]
      });
      
      res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });

router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const project = await Project.findOne({
        where: { 
          id: req.params.id
        }
      });
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const project = await Project.findOne({
        where: { 
          id: req.params.id
        }
      });
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      await project.destroy();
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;