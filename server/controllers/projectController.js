const Project = require('../../models/Project');
const User = require('../../models/User');

// Créer un nouveau projet
exports.createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const project = await Project.create({ title, description, ownerId: req.user.id });
        res.status(201).json({ message: 'Projet créé', project });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création du projet' });
    }
};

// Modifier un projet existant
exports.updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description } = req.body;
        const project = await Project.findByPk(projectId);
        if (project && project.ownerId === req.user.id) {
            project.update({ title, description });
            res.json({ message: 'Projet mis à jour', project });
        } else {
            res.status(403).json({ error: 'Non autorisé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du projet' });
    }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByPk(projectId);
        if (project && project.ownerId === req.user.id) {
            await project.destroy();
            res.json({ message: 'Projet supprimé' });
        } else {
            res.status(403).json({ error: 'Non autorisé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
    }
};

// Ajouter ou supprimer des membres dans un projet
exports.manageMembers = async (req, res) => {
    try {
        // Logique pour ajouter ou supprimer des membres
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la gestion des membres' });
    }
};

// Promouvoir un membre en administrateur
exports.promoteMember = async (req, res) => {
    try {
        // Logique pour promouvoir un membre en administrateur
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la promotion' });
    }
};

exports.uploadFile = async (req, res) => {
    try {
        const { projectId } = req.params;
        const file = req.file;
        res.json({ message: 'Fichier téléchargé', file });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
    }
};
