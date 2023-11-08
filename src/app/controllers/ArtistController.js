const Artist = require('../models/artist');
const shortid = require('shortid');

const cloudinary = require('cloudinary').v2;
const stringImage = require('../../utils/sliceStringImage');

class ArtistController {
    // [POST] /api/v1/artist/create
    async create(req, res, next) {

        try {
            const artist = new Artist({
                ...req.body,
                title: req.body.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '-'),
                encodeId: shortid.generate(),
                createDate: Date.now(),
            });

            await artist.save();

            
            res.status(200).json({
                success: true,
                artist,
            });

        } catch (error) {
            const filename = stringImage(req.body.image);
            cloudinary.uploader.destroy(filename);

            console.log(error)
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

}

module.exports = new ArtistController();
