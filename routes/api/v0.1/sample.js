const router = require("express").Router()

/**
 * @swagger
 * tags:
 * - name: 'Users'
 * - name: 'Session'
 *
 */

/**
 * @swagger
 * paths:
 *   /sample/{sampleParam}:
 *     put:
 *       tags:
 *       - 'Sample'
 *       description: 'Sample post request'
 *       parameters:
 *         - in: path
 *           name: 'refreshToken'
 *           schema:
 *             type: string
 *           required: true
 *           description: Refresh Token to be used to refresh the session
 *       request-body:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: 'successfull operation'
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: 'bad request'
 */
router.put("/:sampleParam", async (req, res) => {
  try {
    const { sampleParam } = req.params
    const success = await doSomethingAsync(sampleParam)
    if (!success) res.sendStatus(400)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

module.exports = router

const doSomethingAsync = (param) => {
  return new Promise((resolve, reject) => {
    resolve(true)
  })
}
