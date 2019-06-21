const Voting = require('../models/model-voting')
const Users = require('../models/model-user')
const ObjectId = require('mongoose').Types.ObjectId; 


class ControllerVote {
  static addVoting(req, res, next) {
    let loginUserId = req.userId
    let otherUserId = req.params.id
    Voting.find({
      loginUser: loginUserId,
      otherUser: otherUserId
    })
      .then((vote_trxs) => {
        if (vote_trxs.length != 0) {
          throw { code: 400, message: 'User already vote this user'}
        }
        if (loginUserId === otherUserId) {
          throw { code: 400, message: "Can't vote to yourself"}
        } else {
          return Voting.create({
            loginUser: ObjectId(loginUserId),
            otherUser: ObjectId(otherUserId),
          })
        }
      })
      .then((createdVote) => {
        res.status(201).json(createdVote)
      })
      .catch(next)
  }


  static deleteVoting(req, res, next) {
    let otherUserId = req.params.id
    Voting.findOne({
      loginUser: req.userId,
      otherUser: otherUserId
    })
      .then((vote) => {
        if (!vote) throw { code: 404 }
        else {
          return Voting.deleteOne({ _id: vote._id})
        } 
      })
      .then((data) => {
        res.status(201).json(data)
      })
      .catch(next)
  } 

  static readAll(req, res, next) {
    Voting.find().populate('loginUser').populate('otherUser')
      .then((votes) => {
        res.json(votes)
      })
      .catch(next)
  }

  static getNewUsers(req, res, next) {
    Users.aggregate([
      {
        $project: {
          _id: 1,
          full_name: 1,
          email: 1,
          gender: 1,
          emotion: 1,
          image: 1,
        }
      }
    ])
      .then((users) => {
        res.status(200).json(users)
      })
      .catch(next)
  }

  static readAllTop20(req, res, next) {
    Voting 
      .aggregate(
        [
          { 
            $group: { 
            _id: "$otherUser",
            count: {$sum: 1}
            },
          },{
            $sort: {
              count: -1
            }
          }, { 
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
        res.status(200).json(result)
      })
      .catch(next)
  }
}

module.exports = ControllerVote