const User = require('../models/model-user')
const { compareHash } = require('../helpers/hash-helpers')
const { generateToken } = require('../helpers/jwt-helper')

class ControllerUser {
  static login(req, res, next) {
    let { email, password } = req.body
    let userData
    User.findOne({ email: email })
      .then((user) => {
        userData = user
        if (!user) next({code: 401, message: 'Username / password Invalid'})
        else {
          return compareHash(password, user.password)
        }
      })
      .then(result => {
        if (!result) next({code: 401, message: 'Username / password Invalid'})
        else {
          let payload = {
            userId: userData._id
          }          
          let token = generateToken(payload)
          res.json({
            token: token
          })
        }
      })
      .catch(next)
  }

  static register(req, res, next) {
    let schemaField = Object.keys(User.prototype.schema.paths)
    let filteredField = Object.keys(req.body).filter((x) => schemaField.indexOf(x) > -1)
    let newUser = filteredField.reduce((acc, el) => Object.assign(acc, {[el]: req.body[el]}), {})
    User.create(newUser)
      .then((user) => {
        res.json(user)
      })
      .catch(next)
  }

  static profileData(req, res, next) {
    User.findOne({ _id: req.userId })
      .then((result) => {
        let sendData = {
          full_name: result.full_name,
          username: result.username,
          email: result.email,
          id: result._id
        }
        res.json(sendData)
      })
      .catch((err) => {
        console.log(err);
        next()
      })
  }
}

module.exports = ControllerUser