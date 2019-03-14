const router = require('express').Router();

router.use('/product', require('./Product.route'))
router.use('/provider', require('./Provider.route'))
router.use('/document', require('./Document.route'))

module.exports = router;

