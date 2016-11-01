var express = require('express');
var multer = require('multer');

var multipart = multer();
var tapplications = express.Router();

var downloadManager = require('../managers/downloadManager.js');

tapplications.post('/index.php', multipart.array(), function(req, res) {
	console.log(req.body);

	if(req.body.method == 'get_track') {
		// app wants a download

		if('song_id' in req.body) {
			downloadManager.getSingleTrackMetadata(req.body.song_id, function(metadata) {
				res.send(metadata);
			});
		} else {
			// multiple songs
			// nunjucks the shit out of this eventually
		}
	}

	// scoremanager beta
	if(req.body.method == 'scores_add') {
		require('../managers/scoreManager.js').submitNewScore(req.body.scores, req.io, function() {
			console.log('emitted event');
		});
	}
});

tapplications.get('/tracks/:songId/:songFile', function(req, res) {
	downloadManager.getSongFilePath(req.params.songId, req.params.songFile, function(path) {
		res.sendFile(path, {root: __dirname + '/../cdn/'});
	});
});

tapplications.get('/themes/:themeName', function(req, res) {
	downloadManager.getThemeZip(req.params.themeName, function(themeStream) {
		themeStream.pipe(res);
	});
});

module.exports = tapplications;
