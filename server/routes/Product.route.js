const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('Product');

router.get('/', controller.default)

module.exports = router;