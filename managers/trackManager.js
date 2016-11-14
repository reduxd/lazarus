/*
	trackManager

	All tracks within the CDN directory are analyzed and returned
	in an array with their names, artists, and difficulties. Most
	if not all of the code and techniques used here are also
	found in downloadManager, as they both access the song files.
 */

var plist = require('plist');
var async = require('async');
var bplist = require('bplist-parser');
var fs = require('fs');
var path = require('path');

exports.getTracks = function(cdnPath, callback) {
	var trackDirs = fs.readdirSync(cdnPath + '/').filter(function(file) {return fs.statSync(path.join(cdnPath + '/', file)).isDirectory();});

	async.series([function(callback){
		var tmpTracks = [];

		async.each(trackDirs, function(curDir, callback) {
			/*
				Songs come in a variety of formats due to the workings of plist.
				So far, I've seen text plists, text plists with embedded binary,
				and binary plists. Only text plists with embedded binary have
				been implemented, but the parser should be able to handle the
				other two types without much problem.
			 */
			var outsideObj = plist.parse(fs.readFileSync(cdnPath + '/' + curDir + '/info.plist', 'utf8'));

			/*
			 	XML with Binary

			 	Keys are read from the song plists, and the data is used to
			 	generate an array of songs available.
			 */
			bplist.parseFile(outsideObj['data'], function(err, insideObj) {
				if (err) throw err;

				var id = curDir.substring(0, curDir.indexOf('.track'));
				var title = insideObj[0].kTTRDownloadableItemTitleKey;
				var artist = insideObj[0].kTTRDownloadableItemSubtitleKey;
				var diffs = insideObj[0].availableDifficultyLevels;

				tmpTracks.push({id: id, title: title, artist: artist, diffs: diffs});

				callback();
			});

		}, function() {
			callback(tmpTracks);
		});
	}], function(tracklist) {
		callback(tracklist);
	});
}
