const express = require('express');

const router = express.Router();
const settingsController = require('../controllers/settings');

router.get('/', settingsController.getAll);
router.get('/:sectionName', settingsController.getSection);
router.put('/', settingsController.updateAll);
router.put('/:sectionName', settingsController.updateSection);

module.exports = router;
