const { Project } = require('../models');

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      UserId: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { UserId: req.user.id }
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        UserId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        UserId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update(req.body);
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        UserId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};