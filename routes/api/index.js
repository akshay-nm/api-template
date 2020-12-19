const router = require('express').Router()

/**
 * @swagger
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const jwtValidation = require('express-jwt')
const jwt = require('jsonwebtoken')

router.use(
  jwtValidation({
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    algorithms: ['HS256'],
  }).unless({
    path: [
      { url: '/api/users', methods: ['POST'] },
      { url: /^\/docs\.*/ },
      { url: '/api/sessions', methods: ['POST', 'PUT'] },
      { url: '/api/sessions/refresh', methods: ['POST'] },
      { url: '/api/sessions/revoke', methods: ['POST'] },
    ],
  }),
)

// JWT validation failure, issue a new JWT if validation successful
router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.log('Error while trying to authorize user: ', err)
    res.sendStatus(401)
  } else {
    // create a new JWT
    jwt.sign({ sub: req.user.id, id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    })
    next()
  }
})

router.use('/sessions', require('./sessions'))
router.use('/users', require('./users'))

module.exports = router
