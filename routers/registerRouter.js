/*
 registerRouter
 */

var express = require('express');
var bodyParser = require('body-parser');

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
    var uidInfo = req.body.uidInfo;

    /*
     implement checking to see if uid or screenname are already taken

     don't send an auto ok
     */
    res.send('ok');
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