var plist = require('plist');
var async = require('async');
var bplist = require('bplist-parser');
var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

exports.getSingleTrackMetadata = function(songId, callback) {
	var outsideObj = plist.parse(fs.readFileSync(require('../tt.js').cdnPath + '/tracks/' + songId + '.track/info.plist', 'utf8'));

	//xml with binary

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

exports.getSongFilePath = function(songId, songFile, callback) {
	callback('tracks/' + songId + '.track/' + songFile);
}

exports.getThemeZip = function(themeName, callback) {
	var theme = archiver('zip');
	var noZipName = themeName.replace('.zip', '');
	theme.directory(require('../tt.js').cdnPath + '/themes/' + noZipName, noZipName, {name: noZipName});
	theme.finalize();

	callback(theme);
}
