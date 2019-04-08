const router = require('express').Router();

// TODO: init using an array
router.use('/products', require('./Product.route'))
router.use('/providers', require('./Provider.route'))
router.use('/documents', require('./Document.route'))
router.use('/dashboard', require('./Dashboard.route'))
router.use('/history', require('./History.route'))
router.use('/vat', require('./Vat.route'))

router.post('/file', require('../controllers/File.controller'));

module.exports = router;

