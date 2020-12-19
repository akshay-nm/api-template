const jwt = require('jsonwebtoken')

module.exports = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      id: user.id,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
    },
  )
}
