const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('document', 'Document');

router.post('/', controller.getAll.bind(controller))
router.post('/insert', controller.insertOne.bind(controller))
router.put('/update', controller.updateOne.bind(controller))
router.delete('/delete', controller.deleteOne.bind(controller))

module.exports = router;