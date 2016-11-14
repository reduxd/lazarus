/*
	cacheManager

	On launch, all tracks in CDN are analyzed and processed into
	"featured.html". Faster doing it on every launch rather than
	on every request for the featured page.

	NOTE: This will be moved towards Redis instead of an array
	in the near future.
 */

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
