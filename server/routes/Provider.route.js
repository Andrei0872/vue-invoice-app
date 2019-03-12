const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('Provider');

router.post('/', controller.getAll.bind(controller))

module.exports = router;