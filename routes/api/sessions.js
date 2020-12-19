const path = require('path')
const appDir = path.dirname(require.main.filename)
const service = require(path.join(appDir, '/services')).sessions
const forbiddenChecks = require(path.join(appDir, '/403s')).sessions
const validate = require(path.join(appDir, '/400s')).sessions
const { generateAccessTokenForUser, generateRefreshTokenValue, matchPasswords } = require(path.join(
  appDir,
  '/utils/misc/',
))
const userService = require(path.join(appDir, '/services')).users
const resourceType = 'SESSIONS'

const router = require('express').Router()

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     SessionPostPayload:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: akshay.kumar@poplink.in
 *         password:
 *           type: string
 *           example: asdasd
 *     SessionPostResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *     SessionGetResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: string
 *         ip:
 *           type: string
 *         expiresAt:
 *           type: string
 *         issuedAt:
 *           type: string
 *     SessionRefreshPayload:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         refreshToken:
 *           type: string
 *     SessionRefreshResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *     SessionRevokePayload:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         refreshToken:
 *           type: string
 */

/**
 * @swagger
 * paths:
 *   /sessions:
 *     get:
 *       tags:
 *       - Sessions
 *       summary: Get all sessionIds
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: string
 *         400:
 *           description: bad request
 *         401:
 *           description: unauthorized
 *         403:
 *           description: forbidden
 *         500:
 *           description: internal server error
 *       security:
 *         - bearerAuth: []
 */

router.get('/', validate.getAll, forbiddenChecks.getAll, async (req, res) => {
  try {
    const ids = await service.getAll()
    res.json(ids)
  } catch (error) {
    console.log(`500::${resourceType}:GETALL-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /sessions:
 *     post:
 *       tags:
 *       - Sessions
 *       summary: Create session
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionPostPayload'
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SessionPostResponse'
 *         400:
 *           description: bad request
 *         500:
 *           description: internal server error
 */
router.post('/', validate.create, forbiddenChecks.create, async (req, res) => {
  try {
    const { email, password } = req.body
    const userIds = await userService.search({ email })
    const user = await userService.get(userIds[0])

    if (!user) res.sendStatus(400)
    else if (!matchPasswords(password, user.toObject().passwordHash)) res.sendStatus(400)
    else {
      const refreshToken = await service.create({
        user: user.id,
        ip: req.ip,
        token: generateRefreshTokenValue(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      })
      const accessToken = await generateAccessTokenForUser(user)
      res.json({ accessToken, refreshToken: refreshToken.token })
    }
  } catch (error) {
    console.log(`500::${resourceType}:POST-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /sessions/{sessionId}:
 *     get:
 *       tags:
 *       - Sessions
 *       summary: Get session by ID
 *       parameters:
 *         - in: path
 *           name: sessionId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SessionGetResponse'
 *         400:
 *           description: bad request
 *         401:
 *           description: unauthorized
 *         403:
 *           description: forbidden
 *         500:
 *           description: internal server error
 *       security:
 *         - bearerAuth: []
 */
router.get('/:id', validate.get, forbiddenChecks.get, async (req, res) => {
  try {
    const { id } = req.params
    const resource = await service.get(id)
    res.json(resource)
  } catch (error) {
    console.log(`500::${resourceType}:GET-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /sessions/refresh:
 *     post:
 *       tags:
 *       - Sessions
 *       summary: Refresh session by userId and refreshToken
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionRefreshPayload'
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SessionRefreshResponse'
 *         400:
 *           description: bad request
 *         500:
 *           description: internal server error
 */
router.post('/refresh', validate.refresh, forbiddenChecks.refresh, async (req, res) => {
  try {
    const { user, refreshToken } = req.body
    const existingTokens = await service.search({
      user,
      ip: req.ip,
      token: refreshToken,
    })
    if (!existingTokens[0]) res.sendStatus(400)
    else {
      const newRefreshToken = await service.create({
        user,
        ip: req.ip,
        token: generateRefreshTokenValue(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      })
      await service.update(existingTokens[0], {
        replacedBy: newRefreshToken._id,
        replacedAt: new Date(Date.now()),
      })

      const userData = await userService.get(user)
      const accessToken = generateAccessTokenForUser(userData)

      res.json({ refreshToken: newRefreshToken.token, accessToken })
    }
  } catch (error) {
    console.log(`500::${resourceType}:PUT-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /sessions/revoke:
 *     post:
 *       tags:
 *       - Sessions
 *       summary: Revoke session by userId and refreshToken
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionRevokePayload'
 *       responses:
 *         200:
 *           description: successful operation
 *         400:
 *           description: bad request
 *         500:
 *           description: internal server error
 *       security:
 *         - bearerAuth: []
 */
router.post('/revoke', validate.revoke, forbiddenChecks.revoke, async (req, res) => {
  try {
    const { user, refreshToken } = req.body
    const ids = await service.search({
      user,
      token: refreshToken,
      ip: req.ip,
    })
    console.log(await service.get(ids[0]))
    console.log(ids)
    await service.update(ids[0], { revokedAt: new Date(Date.now()) })
    console.log(await service.get(ids[0]))
    res.sendStatus(200)
  } catch (error) {
    console.log(`500::${resourceType}:DELETE-`, error)
    res.sendStatus(500)
  }
})

module.exports = router
