/*
	storeRouter

	This router handles store access points such as "featured" and "browse". As
	of right now, we only support "featured", because the game jumps to this
	page first. Eventually this should have a dynamic page influenced by the
	most downloaded, top picks, etc.
 */

var express = require('express');
var store = express.Router();

var trackManager = require('../managers/trackManager.js');

/*
	Featured
 */
store.get('/featured', function(req, res) {
	res.render('featured.html');
});

module.exports = store;
