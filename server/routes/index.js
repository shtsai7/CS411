/*jslint node:true */
var express = require('express');
var router = express.Router();
var app = express()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { name: 'CS411A2', status: 'ok' });
});


/* GET result page. */
router.get('/:name', function(req, res, next) {
    console.log(req.params.name);
    res.json(req.params.name);
});


module.exports = router;

