const router = require('express').Router();
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');

router.post('/', auth, projectController.createProject);
router.get('/', auth, projectController.getAllProjects);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;