const songRouter = require('./_song');
const genreRouter = require('./genre');
const artistRouter = require('./artist');
const userRouter = require('./user');
const cloudRouter = require('./cloud');
const playlistRouter = require('./playlist');
const albumRouter = require('./album');
const partnerRouter = require('./partner');
const weekchartRouter = require('./weekchart');
const pageExploreRouter = require('./pageExplore');

function routes(app) {

    app.use("/api/v1/song", songRouter);

    app.use("/api/v1/genre", genreRouter);

    app.use("/api/v1/artist", artistRouter);

    app.use("/api/v1/user", userRouter);

    app.use("/api/v1/cloudinary", cloudRouter);

    app.use("/api/v1/playlist", playlistRouter);

    app.use("/api/v1/album", albumRouter);

    app.use("/api/v1/partner", partnerRouter);

    app.use("/api/v1/weekchart", weekchartRouter);

    app.use("/api/v1/page/explore", pageExploreRouter);

}

module.exports = routes;