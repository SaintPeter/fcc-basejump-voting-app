'use strict';

var sanitizeHtml = require('sanitize-html');
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

// Automatically remove HTML from public facing fields on save
PollSchema.pre('save', function(next) {
  var sanitize = {
    allowedTags: [],
    allowedAttributes: []
  };

  this.question = sanitizeHtml(this.question, sanitize);
  this.owner_name = sanitizeHtml(this.owner_name, sanitize);
  this.options = this.options.map(function(option){
      option.text = sanitizeHtml(option.text, sanitize);
      return option;
    });
  next();
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

  poll.options.forEach(function(option){
    labels.push(option.text);
  });

  return labels;
});

PollSchema.virtual('chartData').get(function() {
  var poll = this,
      data = [];

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

// Disable version key
PollSchema.set('versionKey', false);


module.exports = mongoose.model('Poll', PollSchema);
