const path = require('path')
const router = require('express').Router()

router.use('/api', require('./api'))
router.use('/docs', require('./docs'))
router.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.ico'))
})

module.exports = router
