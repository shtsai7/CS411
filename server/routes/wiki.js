/*jslint node:true */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/CS411/server');

var Schema = mongoose.Schema;
var WikiInfo = new Schema({
    parse: {
        title: String,
        pageid: String,
        text:{
            "*": String
        }
    }
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
            res.json({message: 'wikiInfo saved'});
        }
    });
});

router.get('/db', function(req, res, next) {
    wiki.find({}, function (err, results) {
        if (err) {
            console.log("error when find db")
        } else {
            console.log("find all db")
            res.json(results);
        }
    });
});

router.get('/db/:pageid', function(req, res, next) {
    wiki.findOne({'parse.pageid': req.params.pageid}, function(err, results){
        if (err) {
            console.log("error when find db, pageid=%s",req.params.pageid)
        } else {
            console.log("find pageid=%s",req.params.pageid)
            console.log(results)
            res.json(results);
        }
    });
 });

router.delete('/db/:pageid', function(req, res, next) {
    wiki.find({'parse.pageid': req.params.pageid}).remove(function(err){
        if (err) {
            console.log("error when detele db, pageid=%s",req.params.pageid)
        } else {
            console.log("delete pageid=%s",req.params.pageid)
            res.json({message: 'wiki info deleted'})
        }
    });
});

module.exports = router;
