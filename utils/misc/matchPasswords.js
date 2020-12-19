const bcrypt = require('bcryptjs')

module.exports = (password, hash) => !!bcrypt.compareSync(password, hash)
