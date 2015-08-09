'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  question: String,
  created: Date,
  owner: String,
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

PollSchema.virtual('voteFor').set(function(voteFor) {
  var option = parseInt(voteFor);
  if(this.votes[option]) {
    // Increment the vote
    this.votes[option]++;
  } else {
    // first vote
    this.votes[option] = 1;
  }
  this.totalVotes = votes.reduce(function(prev, curr) {
    return prev + curr;
  });
});

module.exports = mongoose.model('Poll', PollSchema);
