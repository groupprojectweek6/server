const User = require('../models/model-user')
const Voting = require('../models/model-voting')
const { compareHash } = require('../helpers/hash-helpers')
const { generateToken } = require('../helpers/jwt-helper')
const ObjectId = require('mongoose').Types.ObjectId; 

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
            token: token,
            userId: userData._id
          })
        }
      })
      .catch(next)
  }

  static register(req, res, next) {
    let newUser = {
      full_name: req.body.full_name,
      password: req.body.password,
      email: req.body.email,
      gender: req.gender,
      emotion: req.emotion,
      image: req.file.gcsUrl
    }
    User.create(newUser)
      .then((user) => {
        res.json(user)
      })
      .catch(next)
  }

  static profileData(req, res, next) {
    console.log('ini req userId', req.userId);
    console.log('ini req userId', typeof req.userId);
    
    Voting 
      .aggregate(
        [
          { 
            $group: { 
            _id: "$otherUser",
            count: {$sum: 1}
            },
          }, {
            $match: {
              _id: ObjectId(req.userId)
            }
          },{ 
            $lookup: {
              from: 'users', 
              localField: '_id', 
              foreignField: '_id', 
              as: 'dataUser'
            },
          },{
            $project: {
              _id: 1,
              count: 1,
              "dataUser.full_name": 1,
              "dataUser.email": 1,
              "dataUser.gender": 1,
              "dataUser.emotion": 1,
              "dataUser.image": 1,
            } 
          }
        ]
      )
      .then((result) => {
        console.log('hasil aggregation', result);
        console.log(result[0]._id);
        console.log(result[0].dataUser);
        console.log(typeof result[0]._id);
        
        res.status(200).json(result[0])
      })
      .catch(next)
    // User.findOne({ _id: req.userId })
    //   .then((result) => {
    //     let sendData = {
    //       full_name: result.full_name,
    //       email: result.email,
    //       id: result._id,
    //       gender: result.gender,
    //       emotion: result.emotion,
    //       image: result.image
    //     }
    //     res.status(200).json(sendData)
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     next()
    //   })
  }
}

module.exports = ControllerUser

// $lookup: {
//   from: 'users', 
//   localField: '_id', 
//   foreignField: '_id', 
//   as: 'dataUser'
// },
// },{
// $project: {
//   _id: 1,
//   count: 1,
//   "dataUser.full_name": 1,
//   "dataUser.email": 1,
//   "dataUser.gender": 1,
//   "dataUser.emotion": 1,
//   "dataUser.image": 1,
// } 