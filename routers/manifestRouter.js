/*
 manifestRouter
 */

var express = require('express');
var manifest = express.Router();

/*
 All
 */
manifest.get('/all/', function(req, res) {
    /*
     Implement JSON manifest

     {
        "fragments":{
            "home_promo":{
                "version":1484551197,
                "url":"http:\/\/ttr4.apps.tapulous.com\/ttr\/ttr4cmd\/fragments\/home_promo"
            },
            "tap_js":{
                "version":1341283111,
                "url":"http:\/\/ttr4.apps.tapulous.com\/ttr\/ttr4cmd\/fragments\/tap_js"
            },
            "tap_css":{
                "version":1318902747,
                "url":"http:\/\/ttr4.apps.tapulous.com\/ttr\/ttr4cmd\/fragments\/tap_css"
            }
        },
        "pages":{
            "home":1335305781,
            "profile":1335305781,
            "news":1335305781,
            "register":1335305781,
            "popups":1335305781,
            "store":1335305781
        },
        "media":[]
     }
     */
});

module.exports = manifest;
