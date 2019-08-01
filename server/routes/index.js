const router = require('express').Router();

const jwtMiddleware = require('../middlewares/jwt.middleware');

router.use('/products', jwtMiddleware, require('./Product.route'))
router.use('/providers', jwtMiddleware, require('./Provider.route'))
router.use('/documents', jwtMiddleware, require('./Document.route'))
router.use('/dashboard', jwtMiddleware, require('./Dashboard.route'))
router.use('/history', jwtMiddleware, require('./History.route'))
router.use('/vat', jwtMiddleware, require('./Vat.route'))

router.post('/file', jwtMiddleware, require('../controllers/File.controller'));

router.use('/auth', require('./User.route'));

module.exports = router;
