const path = require('path')
const appDir = path.dirname(require.main.filename)
const service = require(path.join(appDir, '/services')).users

const resource = 'USERS'

const getAll = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`403::${resource}:GETALL-`, error)
    res.sendStatus(403)
  }
}

const create = async (req, res, next) => {
  try {
    const { email } = req.body

    const existingUsers = await service.search({ email })

    if (existingUsers[0]) throw Error('user trying to create duplicate account')

    next()
  } catch (error) {
    console.log(`403::${resource}:POST-`, error)
    res.sendStatus(403)
  }
}

const get = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`403::${resource}:GET-`, error)
    res.sendStatus(403)
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { authId } = req.user

    if (id !== authId) throw Error("user attempting to change someone else's data")

    next()
  } catch (error) {
    console.log(`403::${resource}:UPDATE-`, error)
    res.sendStatus(403)
  }
}

const terminate = async (req, res, next) => {
  try {
    const { id } = req.params
    const { authId } = req.user

    if (id !== authId) throw Error("user attempting to delete someone else's data")

    next()
  } catch (error) {
    console.log(`403::${resource}:TERMINATE-`, error)
    res.sendStatus(403)
  }
}

module.exports = { getAll, create, get, update, terminate }
