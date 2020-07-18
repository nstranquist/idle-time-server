const projectsController = require('../app/api/controllers/projects')
const express = require('express')
const router = express.Router();

router.get('/', projectsController.getAll)
router.post('/', projectsController.addOne)
router.put('/:id', projectsController.updateOne)
router.delete('/:id', projectsController.deleteOne)

module.exports = router;