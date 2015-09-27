'use strict';

var express = require('express');
var controller = require('./poll.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/friendly/:id', controller.friendly);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.put('/vote/:id', controller.vote);
router.get('/clear/:id', auth.isAuthenticated(), controller.clearVotes);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
