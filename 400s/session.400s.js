const Joi = require('joi')

const resource = 'SESSIONS'

const getAll = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`400::${resource}:GETALL-`, error)
    res.sendStatus(400)
  }
}

const create = async (req, res, next) => {
  try {
    await Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }).validateAsync(req.body)

    next()
  } catch (error) {
    console.log(`400::${resource}:POST-`, error)
    res.sendStatus(400)
  }
}

const get = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`400::${resource}:GET-`, error)
    res.sendStatus(400)
  }
}

const update = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`400::${resource}:UPDATE-`, error)
    res.sendStatus(400)
  }
}

const terminate = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`400::${resource}:TERMINATE-`, error)
    res.sendStatus(400)
  }
}

const refresh = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`400::${resource}:REFRESH-`, error)
    res.sendStatus(400)
  }
}

const revoke = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`400::${resource}:REVOKE-`, error)
    res.sendStatus(400)
  }
}

module.exports = { getAll, create, get, update, terminate, refresh, revoke }
