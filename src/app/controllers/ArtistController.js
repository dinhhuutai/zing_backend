const Artist = require('../models/artist');
const shortid = require('shortid');


class ArtistController {
    // [POST] /api/v1/artist/create
    async create(req, res, next) {

        try {


            const artist = new Artist({
                ...req.body,
                encodeId: shortid.generate(),
            });

            await artist.save();

            
            res.status(200).json({
                success: true,
                artist,
            });

        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

}

module.exports = new ArtistController();
