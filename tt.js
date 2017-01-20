/*
    Lazarus

    The purpose of this code is to reimplement the Tapulous servers taken down
    once they shutdown Tap Tap Revenge 4. Right now it handles single song
    downloads via the store, with eventual support for community features such
    as scoreboards and maybe multiplayer.

    NOTE: If this gets refactored to run with Docker, a container handling only
    CDN files might be a good idea.
 */

/*
    Server dependencies

    Express - HTTP server handling routes.
    Nunjucks - Rendering of song listings using prebuilt templates.
 */
var express = require('express');
var nunjucks = require('nunjucks');

/*
    Runtime setup
 */
var app = express();
var server = require('http').Server(app);

nunjucks.configure('views', {
    express: app,
    autoescape: true
});

/*
    Arguments

    cdnPath - Name of folder containing "themes" and "tracks"
    cdnHost - Address of running server. Used in the plist generation process
        to provide location for song resources.

    NOTE: cdnHost is a terrible solution to this problem. If not rewritten in
    next revision, this should be a Docker environment variable pointing to
    nginx or the running server.
 */
exports.cdnPath = process.argv[2];
exports.cdnHost = process.argv[3];

/*
    Manager dependencies

    These files handle general server functions used in the main server or in
    routers. While mostly referenced in router files, cacheManager is
    referenced here because it handles the processing of CDN files which is
    done on server launch and not on the fly.

    cacheManager - Processes available tracks and generates the HTML to be
        rendered by storeRouter.
 */
var cacheManager = require('./managers/cacheManager.js');

/*
    Router definitions

    Each endpoint is assigned its own file to make our lives easier with less
    messy code. Also allows easy endpoint addition as well as preventing
    errors with others.

    storeRouter - Handles store requests at "/ttr/ttr4cmd/store".
    manifestRouter - Handles manifest requests at "/ttr/ttr4cmd/manifest".
    tapplicationsRouter - Handles song downloads, scores, and other online game
        functions at "/tapplications/ttr/v3.0".
 */
app.use('/ttr/ttr4cmd/store', require('./routers/storeRouter.js'));
app.use('/ttr/ttr4cmd/manifest', require('./routers/manifestRouter.js'));
app.use('/ttr/ttr4cmd/register', require('./routers/registerRouter.js'));
app.use('/tapservices/v1/tapcoresocial', require('./routers/tapcoresocialRouter.js'));
app.use('/tapplications/ttr/v3.0', require('./routers/tapplicationsRouter.js'));

server.listen(3000, function () {
    console.log('It\'s lit!');

    /*
        cacheManager generates "featured.html", which is rendered by
        storeRouter when the player goes to the store in-game. We do
        this at launch because generating this file one time is
        faster and more efficient than doing it every time the
        endpoint is hit.
     */
    //cacheManager.generateFeatured();
});
