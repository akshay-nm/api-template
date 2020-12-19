const path = require('path')
const appDir = path.dirname(require.main.filename)
const service = require(path.join(appDir, '/services')).samples

const resource = 'SAMPLES'

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
    next()
  } catch (error) {
    console.log(`403::${resource}:UPDATE-`, error)
    res.sendStatus(403)
  }
}

const terminate = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`403::${resource}:TERMINATE-`, error)
    res.sendStatus(403)
  }
}

module.exports = { getAll, create, get, update, terminate }
