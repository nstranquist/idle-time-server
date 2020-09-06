const express = require('express');
const presetsController = require('../controllers/presets');

const presetsRouter = express.Router();

/**
 * @swagger
 * /presets:
 *   get:
 *     description: get all presets
 *
 */
presetsRouter.get('/', presetsController.getAll);
presetsRouter.post('/', presetsController.addOne);
presetsRouter.put('/:id', presetsController.updateOne);
presetsRouter.delete('/:id', presetsController.deleteOne);
// ;presetsRouter.delete('/tasks/:id', presetsController.deleteByTaskId)

module.exports = presetsRouter;
