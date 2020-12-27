const router = require('express').Router()
const path = require('path')
const swaggerJSDoc = require('swagger-jsdoc')

const appDir = path.dirname(require.main.filename)

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sample API',
      version: '0.1.0',
    },
    servers: [{ url: '/api' }],
  },
  apis: [path.join(appDir, '/routes/api/**/*.js')],
}

const spec = swaggerJSDoc(options)
router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(spec)
})

module.exports = router
