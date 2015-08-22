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

PollSchema.virtual('chart').get(function() {
  var poll = this;
  var cd = {
      options: {
        chart: {
          renderTo: 'container',
          type: 'pie'
        },
        tooltip: {
          pointFormat: "{point.y:.2f}%"
        }
      },
      title: {
        text: poll.question
      },
      yAxis: {
        min: 0,
        max: 100
      },
      series: [{
        data: []
      }],
      // xAxis: {
      //   categories: []
      // },
      func: function(chart) {
        $timeout(function() {
          chart.reflow();
        }, 0);
      }
  };

  // Sort the poll options for display
  poll.options = poll.options.sort(function(a,b) {
    return poll.votes[b.id] - poll.votes[a.id];
  });

  var yMax = 0;
  poll.options.forEach(function(option){
    var y = poll.votes[option.id] / poll.totalVotes * 100;
    //cd.xAxis.categories.push(option.text);
    cd.series[0].data.push({
      y: y,
      name: option.text
    });
    yMax = Math.max(yMax, y);
  });

  // Max Y is rounded up to the nearest 10, plus 5, max of 100
  cd.yAxis.max = Math.min(100, Math.ceil(yMax/10) * 10 + 5);

  return cd;
});

// Include charts in output
PollSchema.set('toJSON', {
  virtuals: true
});
//PollSchema.pre('init', PollSchema.methods.updateChart);

module.exports = mongoose.model('Poll', PollSchema);
