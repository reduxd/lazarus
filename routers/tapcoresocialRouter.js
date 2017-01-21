/*
 tapcoresocialRouter
 */

var express = require('express');
var plist = require('plist');
var multer = require('multer');
var multipart = multer();

var tapcoresocial = express.Router();

/*
 Index

 get_profile_and_networks_list - ?
 authentic_user - ?
 */
tapcoresocial.post('/index.php', multipart.array(), function(req, res) {
    if(req.body.method == ('get_profile_and_networks_list' || 'authentic_user')) {
        /*
         get_profile_and_networks_list
         */

        var mongoQuery = req.db.collection('users').find({uid: {$in: [req.body.token_info]}});

        mongoQuery.count(function (err, count) {
            if(count == 0) {
                /*
                 this probably shouldn't be empty...
                 */
                res.send('');
            } else {

                mongoQuery.nextObject(function (err, doc) {
                    var profile_response = {
                        content: {
                            profile: {
                                username: doc.username,
                                email: null,
                                avatar_src: null,
                                large_avatar_src: null,
                                small_avatar_src: null,
                                level_description: '<b>rileyh</b><br>TP: 2400<br>Level:1' },
                            networks: [],
                            summary: {
                                points: '0',
                                level: '1',
                                percentage: '0',
                                next_level: '5',
                                progress: '0 / 5',
                                total_coins: '2000',
                                credits: '50',
                                next_text2: 'Welcome ' + doc.username + '!',
                                points_needed_for_current_level: '0',
                                points_needed_for_next_level: '5'
                            }
                        },
                        token_info: doc.uid,
                        status: {
                            code: 1,
                            reason: 'Success'
                        }
                    };

                    res.send(profile_response);
                });
            }
        });
    }
});

module.exports = tapcoresocial;
