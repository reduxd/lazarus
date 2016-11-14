/*
	tapplicationsRouter

	This router handles the game's main access points, including song downloads,
	user profile management, scores, statistics, and maybe multiplayer. While
	all of these features are set to one endpoint, it may be against the idea of
	having the server be modular.
 */

var express = require('express');
var multer = require('multer');

var multipart = multer();
var tapplications = express.Router();

var downloadManager = require('../managers/downloadManager.js');

/*
	Index

	"index.php" is comprised of form-data, with different parameters depending
	on the method.

	get_track - Handles song download requests.
	scores_add - Handles score management/leaderboards.
 */
tapplications.post('/index.php', multipart.array(), function(req, res) {

	/*
		Song downloads
	 */
	if(req.body.method == 'get_track') {
		if('song_id' in req.body) {
			/*
			 	Single song request
			 */
			downloadManager.getSingleTrackMetadata(req.body.song_id, function(metadata) {
				res.send(metadata);
			});
		} else {
			/*
			 	Implement multiple song request
			 */
		}
	}

	/*
		Score management
	 */
	if(req.body.method == 'scores_add') {
		/*
			Eventually re-implement ScoreManager.
		 */
	}
});

/*
	Song resources

	We assume all requests to "/tracks" are for the CDN, and pass along the file
	from the requested song ID.
 */
tapplications.get('/tracks/:songId/:songFile', function(req, res) {
	downloadManager.getSongFilePath(req.params.songId, req.params.songFile, function(path) {
		res.sendFile(path, {root: __dirname + '/../cdn/'});
	});
});

/*
	Theme resources

	We assume all requests to "/themes" are for the CDN, except theme resources
	must be provided as a zip file. Theme resources are compressed on the spot.
 */
tapplications.get('/themes/:themeName', function(req, res) {
	downloadManager.getThemeZip(req.params.themeName, function(themeStream) {
		themeStream.pipe(res);
	});
});

module.exports = tapplications;
