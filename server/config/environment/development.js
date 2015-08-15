'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOLAB_URI ||
        'mongodb://localhost/mean-dev'
  },

  seedDB: false
};
