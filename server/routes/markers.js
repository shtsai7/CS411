/*jslint node:true */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/CS411/server');

var Schema = mongoose.Schema;
var Marker = new Schema({
    username: String,
    title: String,
    description: String,
    type: String,
    votes: Number,
    latitude: Number,
    longitude: Number
    
});

var markers = mongoose.model('markers', Marker);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('use /markers/db');
});

router.post('/db', function (req, res, next) {
    var marker = new markers(req.body);
    marker.save(function (err) {
        if (err) {
            console.log('error!');
        } else {
            res.json({message: 'marker saved'});    
        }    
    });
});

router.get('/db', function(req, res, next) {
    markers.find({}, function (err, results) {
        res.json(results);
    });
});

/*router.get('/db/:username', function(req, res, next) {
    markers.find({username: req.params.name}, function(err, results){
        res.json(results);
    });
});*/

module.exports = router;
