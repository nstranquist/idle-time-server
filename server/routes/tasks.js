const express = require('express');

const router = express.Router();
const tasksController = require('../controllers/tasks');

router.get('/', tasksController.getAll);
router.post('/', tasksController.addOne);
router.put('/order', tasksController.updateOrder);
router.put('/:taskId', tasksController.updateOne);
router.delete('/:taskId', tasksController.deleteOne);

// router.get('/order', tasksController.getOrder);

// router.post("/login", userController.authenticate);
// router.post("/signup", userController.create);

module.exports = router;
