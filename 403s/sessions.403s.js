const path = require('path')
const appDir = path.dirname(require.main.filename)
const service = require(path.join(appDir, '/services')).sessions

const resource = 'SESSIONS'

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

const refresh = async (req, res, next) => {
  try {
    const { user, refreshToken } = req.body
    const refreshTokenIds = await service.search({ user, token: refreshToken, ip: req.ip })
    console.log(refreshTokenIds)
    if (refreshTokenIds.length !== 1) throw Error('Multiple sessions for same user and device')
    const rt = await service.get(refreshTokenIds[0])
    if (rt.toObject().replacedAt) throw Error('Session already replaced')
    if (rt.toObject().revokedAt) throw Error('Session already revoked')
    if (rt.toObject().expiresAt > new Date(Date.now())) throw Error('Session already expired')
    next()
  } catch (error) {
    console.log(`403::${resource}:REFRESH-`, error)
    res.sendStatus(403)
  }
}

const revoke = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    console.log(`403::${resource}:REVOKE-`, error)
    res.sendStatus(403)
  }
}

module.exports = { getAll, create, get, update, terminate, refresh, revoke }
