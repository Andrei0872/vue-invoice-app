const router = require('express').Router()

const Controller = require('../controllers/Dashboard.controller');
const controller = new Controller(null, 'Dashboard');

router.get('/', controller.getMainOverview.bind(controller))

module.exports = router;