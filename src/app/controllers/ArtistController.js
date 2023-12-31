const Artist = require("../models/artist");
const shortid = require("shortid");

const cloudinary = require("cloudinary").v2;
const stringImage = require("../../utils/sliceStringImage");

class ArtistController {
    // [POST] /api/v1/artist/create
    async create(req, res, next) {
        try {
            const artist = new Artist({
                ...req.body,
                title: req.body.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
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

            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/artist/find
    async find(req, res, next) {
        const limit = req.query.limit;
        const skip = req.query.skip;
        const search = req?.query?.search;

        const name = Number(req?.query?.sortName);
        const createDate = Number(req?.query?.sortCreateDate);
        const contentLastUpdate = Number(req?.query?.sortContentLastUpdate);

        let sort = {};
        if (name === 1 || name === -1) {
            sort = { name: name };
        } else if (createDate === 1 || createDate === -1) {
            sort = { createDate: createDate };
        } else if (contentLastUpdate === 1 || contentLastUpdate === -1) {
            sort = { contentLastUpdate: contentLastUpdate };
        }

        try {
            const artist = await Artist.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    {
                        title: {
                            $regex: new RegExp(search?.replace(/ /g, "-"), "i"),
                        },
                    },
                ],
            })
                .sort(sort)
                .limit(limit)
                .skip(skip);

            const totalArtist = await Artist.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    {
                        title: {
                            $regex: new RegExp(search?.replace(/ /g, "-"), "i"),
                        },
                    },
                ],
            }).count();

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const totalAddToday = await Artist.find({
                createDate: { $gte: today },
            }).count();

            res.status(200).json({
                success: true,
                artist,
                totalArtist,
                totalAddToday,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/artist/delete
    async delete(req, res, next) {
        try {
            const { listId } = req.body;

            listId.map(async (id) => {
                const resDelete = await Artist.findByIdAndDelete(id);

                // if (resDelete) {
                //     const filename = await stringImage(resDelete.image);
                //     await cloudinary.uploader.destroy(filename);
                // }
            });

            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [GET] /api/v1/artist/getSingle/:id
    async getSingle(req, res, next) {
        try {
            const id = req.params.id;

            const artist = await Artist.findById(id);

            return res.status(200).json({
                success: true,
                artist,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [PUT] /api/v1/artist/update/:id
    async update(req, res, next) {
        try {
            const id = req.params.id;

            const artist = await Artist.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    title: req.body.name
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                    contentLastUpdate: Date.now(),
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                artist,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [GET] /api/v1/artist/getAll?search=
    async getAll(req, res, next) {
        try {
            const search = req?.query?.search;

            const artists = await Artist.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    {
                        title: {
                            $regex: new RegExp(search?.replace(/ /g, "-"), "i"),
                        },
                    },
                ],
            })
                .sort({ name: 1 })
                .limit(10);

            return res.status(200).json({
                success: true,
                artists,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }
}

module.exports = new ArtistController();
