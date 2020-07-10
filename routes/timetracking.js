const express = require("express");
const router = express.Router();
const timetrackingController = require("../app/api/controllers/timetracking");

router.get('/', timetrackingController.getAll)
router.get('/:timelogId', timetrackingController.getOne)
router.post('/add', timetrackingController.addOne)
router.put('/:timelogId', timetrackingController.updateOne)
router.delete('/delete/:id', timetrackingController.deleteOne)

module.exports = router;