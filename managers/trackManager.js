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
			var outsideObj = plist.parse(fs.readFileSync(cdnPath + '/' + curDir + '/info.plist', 'utf8'));

			//xml with binary

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
