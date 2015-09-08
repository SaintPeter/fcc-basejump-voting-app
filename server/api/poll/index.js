'use strict';

var express = require('express');
var controller = require('./poll.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/friendly/:id', controller.friendly);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/vote/:id', controller.vote);
router.get('/clear/:id', controller.clearVotes);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
