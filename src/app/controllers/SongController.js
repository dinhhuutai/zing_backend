const Song = require("../models/Song");
const shortid = require('shortid');


class OrderController {
    // [GET] /api/v1/song/:id
    async getSingleSong(req, res, next) {
        res.status(200).json("api/song/:id");
    }

    
    // [GET] /api/v1/song/all
    async getSongs(req, res, next) {
        res.status(200).json("api/song/all");
    }


    // [POST] /api/v1/song/create
    async create(req, res, next) {

        try {


            const song = new Song({
                ...req.body,
                encodeId: shortid.generate(),
            });

            await song.save();

            
            res.status(200).json({
                success: true,
                song,
            });

        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }


    // [PUT] /api/v1/song/update/:id
    async update(req, res, next) {
        res.status(200).json("api/song/update/:id");
    }

    // [DELETE] /api/v1/song/delete/:id
    async delete(req, res, next) {
        res.status(200).json("api/song/delete/:id");
    }
}

module.exports = new OrderController();
