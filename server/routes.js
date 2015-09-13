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

       // Determine
       switch(true) {
         case /facebookexternalhit/i.test(req.useragent.source):
            type = 'facebook';
            break;
         case /Twitterbot/i.test(req.useragent.source):
            type = 'twitter';
            break;
        default:
            type = 'none';
      }
      console.log("Type:", type, "Source:", req.useragent.source);

      // If we recognize the user-agent, pull pollData
      if(type !== 'none') {
        var Poll = require('./api/poll/poll.model');
        promise = Poll.find( { friendly: req.params.friendly }, function (err, poll) {
          if(err) { return handleError(res, err); }
          if(!poll) { return res.status(404).send('Not Found'); }
          pollData = poll[0];
        });
      } else {
        // If we don't do a find, we're fulfilled
        promise.fulfill();
      }

      promise.then(function(){
         res.render('pages/index', {
           type: type,
           pollData: pollData,
           clientIP: req.ip
         });
       });
     });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.render('pages/index', { clientIP: req.ip } );
    });
};
