const { decodeToken } = require('../helpers/jwt-helper')
const User = require('../models/model-user')
const Voting = require('../models/model-voting')
const ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {
  authentication: (req, res, next) => {
    try {
      console.log('########## Checking authentication');
      let payload = decodeToken(req.headers.token)
      User.findOne({_id: payload.userId})
        .then(user => {
          if (!user) {
            console.log('user fail');
            next({ code: 401 })
          }
          console.log('authentication done');
          req.userId = payload.userId
          next()
        })
        .catch(next)
    } catch (err) {
      next({error: err})
    }
    
  },
  authorization: function(req, res, next) {
    console.log('########## Checking authorization');
    try {
      let otherUserId = req.params.id
      let loginUserId = req.userId
      console.log('inputnya', otherUserId, loginUserId);
      
      Voting.findOne({
        otherUser: ObjectId(otherUserId),
        loginUser: ObjectId(loginUserId)
      })
        .then((vote) => {
          console.log('hasil vote', vote);
          console.log('param loginuser', loginUserId);
          
          if (!vote) {
            console.log('unauthorized');
            next({ code: 404 })
          } else if (loginUserId !== vote.loginUser.toString()) {
            console.log('unauthorized');
            throw { code: 404, message: 'Unauthorized' }
          } else {
            console.log('authorization done');
            next()
          }
        })
    } catch (err) {
      next({error: err})
    }
  }
}