const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('vat');

router.route('/')
    .get(controller.getAll.bind(controller))
    .put(controller.simpleUpdate.bind(controller))

module.exports = router;