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
    if(req.body.method == 'get_profile_and_networks_list') {
        /*
         get_profile_and_networks_list
         */

        var profile_response = {
            content: {
                profile: {
                    username: null,
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
                        next_text2: 'next_text2',
                        points_needed_for_current_level: '0',
                        points_needed_for_next_level: '5'
                    }
            },
            token_info: 'token_info',
            status: {
                code: 1,
                reason: 'Success'
            }
        };

        res.send(plist.build(profile_response));
    } else if(req.body.method == 'authentic_user') {
        /*
         authentic_user
         */

        var authentic_response = {
            token_info: 'token_info',
            status: {
                code: 1,
                reason: 'Success'
            },
            content: []
        };

        res.send(plist.build(authentic_response));
    }
});

module.exports = tapcoresocial;
