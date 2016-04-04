/*jslint node:true */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/CS411/server');

var Schema = mongoose.Schema;
var WikiInfo = new Schema({

    title: String,
    pageid: String


});

var wiki = mongoose.model('wiki', WikiInfo);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('use /wiki/db');
});

router.post('/db', function (req, res, next) {
    var WikiInfo = new wiki(req.body);
    WikiInfo.save(function (err) {
        if (err) {
            console.log('error!');
        } else {
            res.json({message: 'marker saved'});
        }
    });
});

router.get('/db', function(req, res, next) {
    wikiInfo.find({}, function (err, results) {
        res.json(results);
    });
});

/*router.get('/db/:username', function(req, res, next) {
 markers.find({username: req.params.name}, function(err, results){
 res.json(results);
 });
 });*/

module.exports = router;
