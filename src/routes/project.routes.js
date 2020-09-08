const express = require('express');
const validator = require('../validators/project.validator');
const { validateBody } = require('../middleware/validate');
const projectsController = require('../controllers/project.controller');

const router = express.Router();

// `/projects` base route
router.get('/', projectsController.getProjectSummaries);
router.post('/', validateBody(validator.createProject), projectsController.createProject);
router.get('/:id', projectsController.getProject);
router.put('/:id', projectsController.updateProjectDetails);
router.delete('/:id', projectsController.deleteProject);

module.exports = router;
