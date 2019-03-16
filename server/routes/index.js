const router = require('express').Router();

router.use('/products', require('./Product.route'))
router.use('/providers', require('./Provider.route'))
router.use('/documents', require('./Document.route'))

module.exports = router;

