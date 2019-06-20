const jwt = require('jsonwebtoken')

module.exports = {
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "24h"})
  },
  decodeToken(token) {
    return jwt.verify(token, process.env.JWT_TOKEN)
  }
}