const bcrypt = require('bcryptjs')

module.exports = (password) => bcrypt.hashSync(password, 10)
