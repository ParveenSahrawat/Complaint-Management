var express = require('express');
var router = express.Router();
var request = require('request');
var User = require('../db/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
