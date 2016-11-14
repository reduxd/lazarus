/*
	downloadManager

	This manager is responsible for song downloads. When the game requests
	a song ID for download, it expects a plist with song information.
	Because we don't have source plists, we have to rebuild them based off
	of the metadata plists when downloaded. This is done on the fly as it
	only involves reading files. Themes are also compressed on the fly as
	all songs we have saved are provided as folders, allowing for easy
	addition of songs floating on the internet as well as compatibility.
 */

var plist = require('plist');
var async = require('async');
var bplist = require('bplist-parser');
var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

exports.getSingleTrackMetadata = function(songId, callback) {
	/*
	 	Songs come in a variety of formats due to the workings of plist.
	 	So far, I've seen text plists, text plists with embedded binary,
	 	and binary plists. Only text plists with embedded binary have
	 	been implemented, but the parser should be able to handle the
	 	other two types without much problem.
	 */
	var outsideObj = plist.parse(fs.readFileSync(require('../tt.js').cdnPath + '/tracks/' + songId + '.track/info.plist', 'utf8'));

	/*
		XML with Binary

		Keys are read from the song plists, and the data is used to
		recreate download plists through a json conversion.

		NOTE: The use of "cdnHost" here is ugly and should be redone.
	 */
	bplist.parseFile(outsideObj['data'], function(err, insideObj) {
		if (err) throw err;

		var patchedFiles = [];

		async.each(insideObj[0].kTTRDownloadableItemCommandsKey, function(item, asyncCallback) {
			if(item.kTTRDownloadableItemDependencyKey == null) {
				item.kTTRDownloadableItemSourceURLKey = 'http://' + require('../tt.js').cdnHost + ':3000/tapplications/ttr/v3.0/tracks/' + songId + '/' + item.kTTRDownloadableItemPreferredFilenameKey;
			} else {
				item.kTTRDownloadableItemSourceURLKey = 'http://' + require('../tt.js').cdnHost + ':3000/tapplications/ttr/v3.0/' + item.kTTRDownloadableItemDependencyKey.replace('Themes', 'themes') + '.zip';
			}
			patchedFiles.push(item);
			asyncCallback();
		}, function() {

			var obj = {
				'content': {
					song: {
						'row_id': insideObj[0].row_id,
						'audioFileDuration': insideObj[0].audioFileDuration,
						'kTTRDownloadableItemSubtitleKey': insideObj[0].kTTRDownloadableItemSubtitleKey,
						'kTTRDownloadableItemTitleKey': insideObj[0].kTTRDownloadableItemTitleKey,
						'kTTRDownloadableItemTypeKey': "track",
						'kTTRDownloadableItemUniqueIdentifierKey': insideObj[0].kTTRDownloadableItemUniqueIdentifierKey,
						'themeName': insideObj[0].themeName,
						'is_hires_hero': 1,
						'kTTRiTunesLink': insideObj[0].kTTRiTunesLink,
						'kTTRAmazonLink': "http://www.amazon.com",
						'kTTRAmazonAlbumASIN': "0000000",
						'kTTRBandLink': insideObj[0].kTTRBandLink,
						'kTTRGenre': insideObj[0].kTTRGenre,
						'columnCountPerLevel': { '1': '3', '2': '3', '3': '3', '4': '3' },
						'kTTRTrackDecryptionKey': insideObj[0].kTTRTrackDecryptionKey,
						'kTTRDownloadableItemCommandsKey': patchedFiles,
						'kTTRDownloadableItemIconURLStringKey': insideObj[0].kTTRDownloadableItemIconURLStringKey,
						'previewURL': insideObj[0].previewURL,
						'kTTRDownloadableItemVersionKey': insideObj[0].kTTRDownloadableItemVersionKey,
						'levelThemes': insideObj[0].levelThemes,
						'availableDifficultyLevels': insideObj[0].availableDifficultyLevels,
						'featured': 0,
						'app_id': 0,
						'price': insideObj[0].price,
						'type': 0
					}
				},
				'token_info': '347bb7f09f734a92890a3bb3d8ac4152f751afdb2c2135d7346e065dd8d060e3c1737cd7272debb103f8b75ef6af40ce',
				'authenticated': '',
				'authenticated_id': '',
				'status': {
					'code': 1,
					'reason': 'success'
				}
			};

			callback(plist.build(obj));
		});
	});
}

/*
	Helper, don't exactly remember what this does.
 */
exports.getSongFilePath = function(songId, songFile, callback) {
	callback('tracks/' + songId + '.track/' + songFile);
}

/*
	Theme zipper
 */
exports.getThemeZip = function(themeName, callback) {
	var theme = archiver('zip');
	var noZipName = themeName.replace('.zip', '');
	theme.directory(require('../tt.js').cdnPath + '/themes/' + noZipName, noZipName, {name: noZipName});
	theme.finalize();

	callback(theme);
}
