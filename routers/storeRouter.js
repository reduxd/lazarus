var express = require('express');
var store = express.Router();

var trackManager = require('../managers/trackManager.js');

store.get('/featured', function(req, res) {
	res.render('featured.html');
});

module.exports = store;
