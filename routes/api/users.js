const path = require('path')
const appDir = path.dirname(require.main.filename)
const service = require(path.join(appDir, '/services')).users
const forbiddenChecks = require(path.join(appDir, '/403s')).users
const validate = require(path.join(appDir, '/400s')).users
const resourceType = 'USERS'

const sessionService = require(path.join(appDir, '/services')).sessions
const driverConfigurationService = require(path.join(appDir, '/services')).driverConfigurations
const farmerConfigurationService = require(path.join(appDir, '/services')).farmerConfigurations
const storageConfigurationService = require(path.join(appDir, '/services')).storageConfigurations
const { generateAccessTokenForUser, generateRefreshTokenValue, hashPassword } = require(path.join(
  appDir,
  '/utils/misc',
))

const router = require('express').Router()

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     UserPostPayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Akshay Kumar
 *         email:
 *           type: string
 *           example: akshay.kumar@poplink.in
 *         password:
 *           type: string
 *           example: asdasd
 *     UserPostResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *     UserGetResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     UserPutPayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     UserPutResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     UserGetDriverConfigurationsResponse:
 *       type: array
 *       items:
 *         type: string
 *     UserGetFarmerConfigurationsResponse:
 *       type: array
 *       items:
 *         type: string
 *     UserGetStorageConfigurationsResponse:
 *       type: array
 *       items:
 *         type: string
 */

/**
 * @swagger
 * paths:
 *   /users:
 *     get:
 *       tags:
 *       - Users
 *       summary: Get all userIds
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
 *   /users:
 *     post:
 *       tags:
 *       - Users
 *       summary: Create user
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostPayload'
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserPostResponse'
 *         400:
 *           description: bad request
 *         403:
 *           description: forbidden
 *         500:
 *           description: internal server error
 */
router.post('/', validate.create, forbiddenChecks.create, async (req, res) => {
  try {
    const { name, password, email } = req.body
    const resource = await service.create({
      name,
      email,
      passwordHash: hashPassword(password),
    })
    const refreshToken = await sessionService.create({
      user: resource.id,
      ip: req.ip,
      token: generateRefreshTokenValue(),
    })
    const accessToken = generateAccessTokenForUser(resource)

    res.json({ accessToken, refreshToken: refreshToken.token })
  } catch (error) {
    console.log(`500::${resourceType}:POST-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /users/{userId}/driver-configurations:
 *     get:
 *       tags:
 *       - Users
 *       summary: Get driverConfigurationIds by userId
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserGetDriverConfigurationsResponse'
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
router.get('/:id/driver-configurations', validate.get, forbiddenChecks.get, async (req, res) => {
  try {
    const { id } = req.params
    const ids = await driverConfigurationService.search({ user: id })
    res.json(ids)
  } catch (error) {
    console.log(`500::${resourceType}:GET_DRIVER_CONFIGURATIONS-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /users/{userId}/storage-configurations:
 *     get:
 *       tags:
 *       - Users
 *       summary: Get storageConfigurationIds by userId
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserGetStorageConfigurationsResponse'
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
router.get('/:id/storage-configurations', validate.get, forbiddenChecks.get, async (req, res) => {
  try {
    const { id } = req.params
    const ids = await storageConfigurationService.search({ user: id })
    res.json(ids)
  } catch (error) {
    console.log(`500::${resourceType}:GET_STORAGE_CONFIGURATIONS-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /users/{userId}/farmer-configurations:
 *     get:
 *       tags:
 *       - Users
 *       summary: Get farmerConfigurationIds by userId
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserGetFarmerConfigurationsResponse'
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
router.get('/:id/farmer-configurations', validate.get, forbiddenChecks.get, async (req, res) => {
  try {
    const { id } = req.params
    const ids = await farmerConfigurationService.search({ user: id })
    res.json(ids)
  } catch (error) {
    console.log(`500::${resourceType}:GET_FARMER_CONFIGURATIONS-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /users/{userId}:
 *     get:
 *       tags:
 *       - Users
 *       summary: Get user by ID
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserGetResponse'
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
 *   /users/{userId}:
 *     put:
 *       tags:
 *       - Users
 *       summary: Update user by ID and payload
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPutPayload'
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserPutResponse'
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
router.put('/:id', validate.update, forbiddenChecks.update, async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body
    const resource = await service.update(id, payload)
    res.json(resource)
  } catch (error) {
    console.log(`500::${resourceType}:PUT-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /users/{userId}:
 *     delete:
 *       tags:
 *       - Users
 *       summary: Delete user by ID
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: successful operation
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
router.delete('/:id', validate.terminate, forbiddenChecks.terminate, async (req, res) => {
  try {
    const { id } = req.params
    await service.terminate(id)
    res.sendStatus(200)
  } catch (error) {
    console.log(`500::${resourceType}:DELETE-`, error)
    res.sendStatus(500)
  }
})

module.exports = router
