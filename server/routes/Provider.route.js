const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('provider')
})

module.exports = router;