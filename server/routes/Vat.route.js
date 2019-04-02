const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('vat');

router.get('/', controller.getAll.bind(controller))
router.put('/update', controller.updateOne.bind(controller))

module.exports = router;