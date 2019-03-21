const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('product');

router.post('/', controller.getAll.bind(controller))
router.post('/insert', controller.insertOne.bind(controller))
router.put('/update', controller.updateOne.bind(controller))

module.exports = router;