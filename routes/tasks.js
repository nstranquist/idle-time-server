const express = require("express");
const router = express.Router();
const tasksController = require("../app/api/controllers/tasks");

router.get('/', tasksController.getAll);
router.post('/add', tasksController.addOne);
router.put('/update/:taskId', tasksController.updateOne);
router.delete('/delete/:taskId', tasksController.deleteOne);

// router.get('/order', tasksController.getOrder);
// router.put('/order', tasksController.updateOrder);

// router.post("/login", userController.authenticate);
// router.post("/signup", userController.create);

module.exports = router;
