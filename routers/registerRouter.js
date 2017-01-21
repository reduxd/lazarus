/*
 registerRouter
 */

var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;

var register = express.Router();

register.post('/get_username', bodyParser.urlencoded({extended: false}), function(req, res) {
    /*
     receive ignore from POST
     */
    var ignore = req.body.ignore;

    var randUser = 'ttr' + Math.floor(Math.random() * (10000000 - 0 + 1));
    console.log('generating username ' + randUser);
    res.send(randUser);
});

register.post('/create_user', bodyParser.urlencoded({extended: false}), function(req, res) {
    /*
    receive screenname, avatar_id, newsletter, and uidInfo from POST
     */
    var screenname = req.body.screenname;
    var avatar_id = req.body.avatar_id;
    var newsletter = req.body.newsletter;

    //if device isn't provisioned then body/form uid is crap?
    var uidInfo = req.cookies.uidInfo;

    req.db.collection('users').insertOne({username: screenname, uid: uidInfo}, function(err, r) {
        res.send('ok');
    });
});

register.get('/check_screenname', function (req, res) {
       var screenname = req.query.screenname;

    req.db.collection('users').find({username: {$in: [screenname]}}).count(function (err, count) {
       if(count == 0) {
           res.send('""');
       } else {
           res.send('"Unavailable"');
       }
    });

});

register.get('/freemusic', function (req, res) {
   res.render('freemusic.html');
});

register.get('/get_avatars', function(req, res) {
    /*
     JSON file with avatar choices here
     */
});

module.exports = register;