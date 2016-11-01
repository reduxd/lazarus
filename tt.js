// packages
var express = require('express');
var nunjucks = require('nunjucks');

// runtime configs
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// routers
var storeRouter = require('./routers/storeRouter.js');
var tapplicationsRouter = require('./routers/tapplicationsRouter.js');

// managers
var cacheManager = require('./managers/cacheManager.js');

// settings
exports.cdnPath = process.argv[2];
exports.cdnHost = process.argv[3];

nunjucks.configure('views', {
	express: app,
	autoescape: true
});

app.use(function(req, res, next){
    req.io = io;
    next();
});

app.use('/ttr/ttr4cmd/store', storeRouter);
app.use('/tapplications/ttr/v3.0', tapplicationsRouter);

app.get('/', function(req, res) {
	res.render('scores.html');
});

server.listen(3000, function () {
  console.log('running');

  // generate featured songlist
  cacheManager.generateFeatured();
});
