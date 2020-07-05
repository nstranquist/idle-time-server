const express = require("express");
const router = express.Router();
const userController = require("../app/api/controllers/users");

router.post("/login", userController.authenticate);
router.post("/signup", userController.create);

module.exports = router;
