/*jslint node:true */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CS411A2', status: 'ok' });
});

module.exports = router;
