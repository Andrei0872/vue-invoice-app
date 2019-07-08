const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('product');

router.route('/')
    .get(controller.getAll.bind(controller))
    .put(controller.updateOne.bind(controller))
    .delete(controller.delete.bind(controller))
    .post(controller.insertOne.bind(controller))

module.exports = router;