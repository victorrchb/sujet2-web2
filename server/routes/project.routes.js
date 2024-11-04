const router = require('express').Router();
const { Project } = require('../models');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Récupère tous les projets
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Crée un nouveau projet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - projectManager
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               projectManager:
 *                 type: string
 */
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { UserId: req.user.id } });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      UserId: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du projet' });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Supprime un projet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const count = await Project.destroy({
      where: { 
        id: req.params.id,
        UserId: req.user.id
      }
    });
    if (count > 0) {
      res.status(200).json({ message: 'Projet supprimé avec succès' });
    } else {
      res.status(404).json({ message: 'Projet non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du projet' });
  }
});

module.exports = router;