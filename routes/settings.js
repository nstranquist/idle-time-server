const express = require("express");
const router = express.Router();
const settingsController = require("../app/api/controllers/settings");

router.get('/', settingsController.get);
router.post('/update', settingsController.update);

module.exports = router;