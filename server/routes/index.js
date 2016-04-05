/*jslint node:true */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Around Me', status: 'ok' });
});

router.get('/result', function(req, res, next) {
    console.log("receive get");
    res.render('result', { title: 'Result', content: 'ok' });
});

router.post('/result', function(req, res, next) {
    console.log("receive post");
    res.render('result', {content: req.body.data});
});

/* GET result page. */
//router.get('/:name', function(req, res, next) {
//    console.log(req.params.name);
//    res.json(req.params.name);
//});


module.exports = router;

