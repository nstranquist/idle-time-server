const express = require('express')
const presetsController = require('../app/api/controllers/presets')

const presetsRouter = express.Router();

presetsRouter.get('/', presetsController.getAll)
presetsRouter.post('/', presetsController.addOne)
presetsRouter.put('/:id', presetsController.updateOne)
presetsRouter.delete('/:id', presetsController.deleteOne)

module.exports = presetsRouter;