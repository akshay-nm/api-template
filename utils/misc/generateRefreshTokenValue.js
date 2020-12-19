const crypto = require('crypto')

module.exports = () => crypto.randomBytes(40).toString('hex')
