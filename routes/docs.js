const router = require('express').Router()
const path = require('path')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const appDir = path.dirname(require.main.filename)

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodAF API',
      version: '0.1.0',
    },
    servers: [{ url: '/api' }],
  },
  apis: [path.join(appDir, '/routes/api/**/*.js')],
}

const swaggerDoc = swaggerJSDoc(options)
//console.log(swaggerDoc)

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerDoc))

module.exports = router
