const router = require('express').Router()
const path = require('path')

router.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, process.env.NODE_ENV === 'production' ? 'redoc.html' : 'redoc.dev.html'),
  )
})

module.exports = router
