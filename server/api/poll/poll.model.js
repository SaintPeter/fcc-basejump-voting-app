'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var slugin = require('slugin');

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

PollSchema.virtual('chartLabels').get(function() {
  var poll = this,
      labels = [];

  // Sort the poll options for display
  poll.options = poll.options.sort(function(a,b) {
    return poll.votes[b.id] - poll.votes[a.id];
  });

  poll.options.forEach(function(option){
    labels.push(option.text);
  });

  return labels;
});

PollSchema.virtual('chartData').get(function() {
  var poll = this,
      data = [];

  // Sort the poll options for display
  poll.options = poll.options.sort(function(a,b) {
    return poll.votes[b.id] - poll.votes[a.id];
  });

  poll.options.forEach(function(option){
    var y = poll.votes[option.id] / poll.totalVotes * 100;
    data.push(poll.votes[option.id]);
  });

  return data;
});

// Slugify the question to a friendly url
PollSchema.plugin(slugin, {
  slugName: 'friendly',
  source: 'question',
  modelName: 'Poll'
});

// Include charts in output
PollSchema.set('toJSON', {
  virtuals: true
});


module.exports = mongoose.model('Poll', PollSchema);
