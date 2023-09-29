const songRouter = require('./user/_song');

function routes(app) {
    // USER
    app.use("/api/song", songRouter);
}

module.exports = routes;