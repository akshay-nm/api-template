const path = require('path')
const appDir = path.dirname(require.main.filename)
const service = require(path.join(appDir, '/services')).samples
const forbiddenChecks = require(path.join(appDir, '/403s')).samples
const validate = require(path.join(appDir, '/400s')).samples
const resourceType = 'SAMPLES'

const router = require('express').Router()

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     SamplePostPayload:
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
 *     SamplePostResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *     SampleGetResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     SamplePutPayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     SamplePutResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 */

/**
 * @swagger
 * paths:
 *   /samples:
 *     get:
 *       tags:
 *       - Samples
 *       summary: Get all sampleIds
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
 *   /samples:
 *     post:
 *       tags:
 *       - Samples
 *       summary: Create sample
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SamplePostPayload'
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SamplePostResponse'
 *         400:
 *           description: bad request
 *         401:
 *           description: unauthorized
 *         403:
 *           description: forbidden
 *         500:
 *           description: internal server error
 */
router.post('/', validate.create, forbiddenChecks.create, async (req, res) => {
  try {
    const resource = await service.create(req.body)
    res.json(resource)
  } catch (error) {
    console.log(`500::${resourceType}:POST-`, error)
    res.sendStatus(500)
  }
})

/**
 * @swagger
 * paths:
 *   /samples/{sampleId}:
 *     get:
 *       tags:
 *       - Samples
 *       summary: Get sample by ID
 *       parameters:
 *         - in: path
 *           name: sampleId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SampleGetResponse'
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
 *   /samples/{sampleId}:
 *     put:
 *       tags:
 *       - Samples
 *       summary: Update sample by ID and payload
 *       parameters:
 *         - in: path
 *           name: sampleId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SamplePutPayload'
 *       responses:
 *         200:
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SamplePutResponse'
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
 *   /samples/{sampleId}:
 *     delete:
 *       tags:
 *       - Samples
 *       summary: Delete sample by ID
 *       parameters:
 *         - in: path
 *           name: sampleId
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
