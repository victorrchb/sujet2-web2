const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/', projectController.createProject);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);
router.post('/:projectId/members', projectController.manageMembers);
router.put('/:projectId/promote', projectController.promoteMember);

module.exports = router;

router.post('/:projectId/upload', upload.single('file'), projectController.uploadFile);
