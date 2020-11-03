const router = require("express").Router()
const path = require("path")
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const appDir = path.dirname(require.main.filename)

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Poplink API",
      version: "0.1.0",
    },
    servers: [{ url: "/api/v0.1" }],
  },
  apis: [path.join(appDir, "/routes/**/*.js")],
}

const swaggerDoc = swaggerJSDoc(options)
//console.log(swaggerDoc)

router.use("/", swaggerUi.serve)
router.get("/", swaggerUi.setup(swaggerDoc))

module.exports = router
