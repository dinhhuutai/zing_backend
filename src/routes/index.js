const songRouter = require('./_song');
const genreRouter = require('./genre');
const artistRouter = require('./artist');
const userRouter = require('./user');

function routes(app) {

    app.use("/api/v1/song", songRouter);

    app.use("/api/v1/genre", genreRouter);

    app.use("/api/v1/artist", artistRouter);

    app.use("/api/v1/user", userRouter);

}

module.exports = routes;