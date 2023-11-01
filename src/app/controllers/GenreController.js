const Genre = require("../models/Genre");
const shortid = require('shortid');


class GenreController {
    // [POST] /api/v1/genre/create
    async create(req, res, next) {

        try {


            const genre = new Genre({
                ...req.body,
                encodeId: shortid.generate(),
            });

            await genre.save();

            
            res.status(200).json({
                success: true,
                genre,
            });

        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

}

module.exports = new GenreController();
