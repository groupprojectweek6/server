'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  loginUser: { type: 'ObjectId', ref: 'User' },
  otherUser: { type: 'ObjectId', ref: 'User' },
}, {timestamps: true});

var Article = mongoose.model('Voting', articleSchema);

module.exports = Article