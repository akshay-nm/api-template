const router = require('express').Router()

router.use('/api', require('./api'))
router.use('/docs', require('./docs'))

module.exports = router
