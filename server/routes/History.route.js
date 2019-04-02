const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('history');

router.get('/', controller.getAll.bind(controller))

module.exports = router;