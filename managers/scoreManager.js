exports.submitNewScore = function(scoreArray, socketio, callback) {
	var jsonScoreArray = JSON.parse(scoreArray);

	var currentScore = jsonScoreArray[jsonScoreArray.length - 1]

	socketio.emit('newScore', currentScore);

	// server-sided score save
	//var accuracy = currentScore.accuracy;
	//var level = currentScore.level;
	//var score = currentScore.score;
	//var totalHit = currentScore.total_hit;
	//var totalMisses = currentScore.total_misses;
	//var trackId = currentScore.track_id;
	//var isComplete = currentScore.is_complete;
	//var bestStreak = currentScore.best_streak;
	//var gameType = currentScore.game_type;
}
