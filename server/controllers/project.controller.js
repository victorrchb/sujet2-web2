const { Project } = require('../models');

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      UserId: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du projet' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { UserId: req.user.id }
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
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
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    await project.update(req.body);
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du projet' });
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
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    await project.destroy();
    res.status(200).json({ message: 'Projet supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du projet' });
  }
};