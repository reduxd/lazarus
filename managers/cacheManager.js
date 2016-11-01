var fs = require('fs');
var nunjucks = require('nunjucks');

var trackManager = require('./trackManager.js');

exports.generateFeatured = function() {
	trackManager.getTracks(require('../tt.js').cdnPath + '/tracks', function(tracklist) {
		console.log(tracklist.length);

		var rendered = nunjucks.render('templates/featured.html', {
			tracks: tracklist
		});

		fs.writeFile('./views/featured.html', rendered, function (err) {
		    console.log('[!] processed cdn tracks');
		});
    });
}
