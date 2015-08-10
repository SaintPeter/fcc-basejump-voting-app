'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  question: String,
  created: Date,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  owner_name: String,
  totalVotes: Number,
  options: [
    {
      id: Number,
      text: String,
    }
  ],
  votes: [],
  voters: [],
  active: Boolean,
});

PollSchema.virtual('voteFor').set(function(voteFor, voterIp) {
  var option = parseInt(voteFor);
  this.votes[option]++;
  this.markModified('votes');
  this.totalVotes = this.votes.reduce(function(prev, curr) {
    return prev + curr;
  });
  this.markModified('totalVotes');
});

module.exports = mongoose.model('Poll', PollSchema);
