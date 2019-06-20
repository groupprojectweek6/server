const bcrypt = require('bcryptjs')

module.exports = {
  generateHash(password) {
    let salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  },
  compareHash(password, hash) {
    return bcrypt.compareSync(password, hash)
  }
}