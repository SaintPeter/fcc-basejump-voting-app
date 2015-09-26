/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/polls', require('./api/poll'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // Allow poll requests
   app.route('/poll/:friendly')
     .get(function(req, res) {
       var Promise = require('mpromise');
       var promise = new Promise;
       var type = '';
       var pollData = {};

      // If we recognize the user-agent, pull pollData
      if(type !== 'none') {
        var Poll = require('./api/poll/poll.model');
        promise = Poll.find( { friendly: req.params.friendly }, function (err, poll) {
          if(err) { return handleError(res, err); }
          if(!poll || poll.length < 1) { return res.status(404).send('Not Found'); }
          pollData = poll[0];
          type = 'poll';  // If we found a poll
        });
      } else {
        // If we don't do a find, we're fulfilled
        promise.fulfill();
      }

      // Once we have the poll data (or not), render the page
      promise.then(function(){
        var ipAddr = req.headers["x-forwarded-for"];
        if (ipAddr){
          var list = ipAddr.split(",");
          ipAddr = list[list.length-1];
        } else {
          ipAddr = req.connection.remoteAddress;
        }
         res.render('pages/index', {
           type: type,
           pollData: pollData,
           clientIP: ipAddr
         });
       });
     });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      var ipAddr = req.headers["x-forwarded-for"];
      if (ipAddr){
        var list = ipAddr.split(",");
        ipAddr = list[list.length-1];
      } else {
        ipAddr = req.connection.remoteAddress;
      }
      res.render('pages/index', { clientIP: ipAddr } );
    });
};
