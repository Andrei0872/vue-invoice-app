const router = require('express').Router();

router.use('/product', require('./Product.route'))
router.use('/provider', require('./Provider.route'))

module.exports = router;

