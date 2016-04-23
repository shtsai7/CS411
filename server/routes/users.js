/*jslint node:true */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CS411/server');

var Schema = mongoose.Schema;
var User = new Schema({
    username: String,
    password: String
    
});

var users = mongoose.model('users', User);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('use /users/db');
});

router.post('/db', function(req, res, next){
    var user = new users(req.body);
    user.save(function (err) {
        if (err){
            console.log('error!');
        }else{
            res.json({message: 'user registered'});    
        }    
    });
});

router.get('/db', function(req, res, next) {
    users.find({}, function (err, results) {
        res.json(results);
    });
});

router.get('/db/:username/:password', function(req, res, next) {
    users.find({username: req.params.username, password: req.params.password}, function(err, results){
        res.json(results);
    });
});

module.exports = router;
