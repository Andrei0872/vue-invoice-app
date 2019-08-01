const router = require('express').Router()

const userController = require('../controllers/User.controller');

router.post('/register', userController.registerUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));

module.exports = router;