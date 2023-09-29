const Song = require("../../models/Song");


class OrderController {
    // [GET] /api/song/:id
    async show(req, res, next) {
        res.status(200).json("api/song/:id");
    }

    // [POST] /api/song/create
    async create(req, res, next) {
        res.status(200).json("api/song/create");
    }


    // [PUT] /api/song/update/:id
    async update(req, res, next) {
        res.status(200).json("api/song/update/:id");
    }

    // [DELETE] /api/song/delete/:id
    async delete(req, res, next) {
        res.status(200).json("api/song/delete/:id");
    }
}

module.exports = new OrderController();
