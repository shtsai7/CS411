/*jslint node:true */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Around Me', status: 'ok' });
});

router.get('/result', function(req, res, next) {
    res.render('result', { title: 'Result', content: 'ok' });
});

router.get('/welcome', function(req, res, next) {
    res.render('welcome', { title: 'Welcome', content: 'ok' });
});

//router.post('/result', function(req, res, next) {
//    console.log("receive post");
//    res.render('result', {content: req.body.data});
//});

/* GET result page. */
router.get('/result/wiki/:pageid', function(req, res, next) {
    console.log(req.params.pageid);
    //res.json(req.params.name);
    var pageid = req.params.pageid;
    res.render('result', 
        {   title: pageid, 
            content: "ok",
            type: "wiki"
        })
});

router.get('/result/user/:id', function(req, res, next) {
    console.log(req.params.id);
    //res.json(req.params.name);
    var id = req.params.id;
    res.render('result',
        {   title: id,
            content: "ok",
            type: "user"
        })
});


router.get('/addmarker/:lat/:lng', function(req, res, next) {
    res.render('marker',
        {   title: 'Add Marker', 
            status: 'ok',
            lat: req.params.lat,
            lng: req.params.lng
        });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Log In', content: 'ok' });
});



module.exports = router;

