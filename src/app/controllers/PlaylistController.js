const Playlist = require("../models/playlist");
const shortid = require("shortid");

const cloudinary = require("cloudinary").v2;
const stringImage = require("../../utils/sliceStringImage");

class PlaylistController {
    // [POST] /api/v1/playlist/create
    async create(req, res, next) {
        try {
            const playlist = new Playlist({
                ...req.body,
                title: req.body.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                encodeId: shortid.generate(),
                createDate: Date.now(),
                isBanner: false,
                createBy: req.id,
            });

            await playlist.save();

            res.status(200).json({
                success: true,
                playlist,
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

    // [POST] /api/v1/playlist/find
    async find(req, res, next) {
        const limit = req.query.limit;
        const skip = req.query.skip;
        const search = req?.query?.search;

        const name = Number(req?.query?.sortName);
        const createDate = Number(req?.query?.sortCreateDate);
        const contentLastUpdate = Number(req?.query?.sortContentLastUpdate);

        const genreId = req.query.selectGenre;

        let sort = {};
        if (name === 1 || name === -1) {
            sort = { name: name };
        } else if (createDate === 1 || createDate === -1) {
            sort = { createDate: createDate };
        } else if (contentLastUpdate === 1 || contentLastUpdate === -1) {
            sort = { contentLastUpdate: contentLastUpdate };
        }

        try {
            const playlist = await Playlist.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    {
                        title: {
                            $regex: new RegExp(search?.replace(/ /g, "-"), "i"),
                        },
                    },
                ],
                genreId: genreId ? { $in: genreId } : { $nin: [] },
            })
                .sort(sort)
                .limit(limit)
                .skip(skip)
                .populate("genreId")
                .populate("createBy", ["name"])
                .populate({
                    path: "songs",
                    populate: {
                        path: "artists",
                    },
                })
                .populate({
                    path: "songs",
                    populate: {
                        path: "genreId",
                    },
                });

            const totalPlaylist = await Playlist.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    {
                        title: {
                            $regex: new RegExp(search?.replace(/ /g, "-"), "i"),
                        },
                    },
                ],
                genreId: genreId ? { $in: genreId } : { $nin: [] },
            }).count();

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const totalAddToday = await Playlist.find({
                createDate: { $gte: today },
            }).count();

            res.status(200).json({
                success: true,
                playlist,
                totalPlaylist,
                totalAddToday,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/playlist/delete
    async delete(req, res, next) {
        try {
            const { listId } = req.body;

            listId.map(async (id) => {
                const resDelete = await Playlist.findByIdAndDelete(id);

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

    // [GET] /api/v1/playlist/getSingle/:id
    async getSingle(req, res, next) {
        try {
            const id = req.params.id;

            const playlist = await Playlist.findById(id)
                .populate("songs")
                .populate("genreId")
                .populate({
                    path: "songs",
                    populate: {
                        path: "artists",
                    },
                })
                .populate({
                    path: "songs",
                    populate: {
                        path: "genreId",
                    },
                });

            return res.status(200).json({
                success: true,
                playlist,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [PUT] /api/v1/playlist/update/:id
    async update(req, res, next) {
        try {
            const id = req.params.id;

            const playlist = await Playlist.findByIdAndUpdate(
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
                playlist,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }
}

module.exports = new PlaylistController();
