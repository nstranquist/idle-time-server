const express = require('express');
const projectsController = require('../controllers/projects');

const router = express.Router();

router.get('/', projectsController.getAll);
router.post('/', projectsController.addOne);
router.put('/:id', projectsController.updateOne);
router.delete('/:id', projectsController.deleteOne);

module.exports = router;
