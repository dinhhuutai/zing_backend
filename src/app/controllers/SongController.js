const Song = require("../models/Song");
const shortid = require("shortid");

class SongController {
    // [POST] /api/v1/song/create
    async create(req, res, next) {
        try {
            const song = new Song({
                ...req.body,
                title: req.body.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                encodeId: shortid.generate(),
                createDate: Date.now(),
            });

            await song.save();

            res.status(200).json({
                success: true,
                song,
            });
        } catch (error) {
            const filename = stringImage(req.body.thumbnail);
            cloudinary.uploader.destroy(filename);

            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/song/find
    async find(req, res, next) {
        const limit = req.query.limit;
        const skip = req.query.skip;
        const search = req?.query?.search;

        const name = Number(req?.query?.sortName);
        const duration = Number(req?.query?.sortDuration);
        const releaseDate = Number(req?.query?.sortReleaseDate);
        const createDate = Number(req?.query?.sortCreateDate);
        const updateDate = Number(req?.query?.sortContentLastUpdate);

        const artists = req.query.selectArtist;
        const genreId = req.query.selectGenre;

        let sort = {};
        if (name === 1 || name === -1) {
            sort = { name: name };
        } else if (createDate === 1 || createDate === -1) {
            sort = { createDate: createDate };
        } else if (updateDate === 1 || updateDate === -1) {
            sort = { updateDate: updateDate };
        } else if (duration === 1 || duration === -1) {
            sort = { duration: duration };
        } else if (releaseDate === 1 || releaseDate === -1) {
            sort = { releaseDate: releaseDate };
        }

        try {
            const song = await Song.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    {
                        title: {
                            $regex: new RegExp(search?.replace(/ /g, "-"), "i"),
                        },
                    },
                ],
                artists: artists ? { $in: artists } : { $nin: [] },
                genreId: genreId ? { $in: genreId } : { $nin: [] },
            })
                .sort(sort)
                .limit(limit)
                .skip(skip)
                .populate("artists")
                .populate("genreId");

            const totalSong = await Song.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    {
                        title: {
                            $regex: new RegExp(search?.replace(/ /g, "-"), "i"),
                        },
                    },
                ],
                artists: artists ? { $in: artists } : { $nin: [] },
                genreId: genreId ? { $in: genreId } : { $nin: [] },
            }).count();

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const totalAddToday = await Song.find({
                createDate: { $gte: today },
            }).count();

            return res.status(200).json({
                success: true,
                song,
                totalSong,
                totalAddToday,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/song/delete
    async delete(req, res, next) {
        try {
            const { listId } = req.body;

            listId.map(async (id) => {
                const resDelete = await Song.findByIdAndDelete(id);

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

    // [GET] /api/v1/song/getSingle/:id
    async getSingle(req, res, next) {
        try {
            const id = req.params.id;

            const song = await Song.findById(id)
                .populate("artists")
                .populate("genreId");

            return res.status(200).json({
                success: true,
                song,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [PUT] /api/v1/song/update/:id
    async update(req, res, next) {
        try {
            const id = req.params.id;

            const song = await Song.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    title: req.body.name
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                    updateDate: Date.now(),
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                song,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [GET] /api/v1/song/getAll?search=
    async getAll(req, res, next) {
        try {
            const search = req?.query?.search;

            const songs = await Song.find({
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
                .limit(10)
                .populate("artists")
                .populate("genreId");

            return res.status(200).json({
                success: true,
                songs,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [PUT] /api/v1/song/listen/:id?ctime=
    async listen(req, res, next) {
        try {
            const id = req.params.id;

            const cTime = req.query?.ctime;

            const currentDate = new Date(cTime * 1000); // Tạo đối tượng Date từ mili giây
            const hours = currentDate.getHours(); // Lấy giờ từ đối tượng Date
            const day = currentDate.getDate(); // Lấy ngày từ đối tượng Date
            const month = currentDate.getMonth(); // Lấy tháng từ đối tượng Date (chú ý: tháng bắt đầu từ 0)
            const year = currentDate.getFullYear(); // Lấy năm từ đối tượng Date

            let cTimeRound = new Date(year, month, day, hours, 0, 0);
            cTimeRound = cTimeRound.getTime() / 1000;

            const song = await Song.findById(id);

            if (song && song.listen[0]?.time === cTimeRound) {
                await Song.updateOne(
                    { _id: id, "listen.time": cTimeRound },
                    { $inc: { "listen.$.counter": 1 } }
                );
            } else {
                await Song.findByIdAndUpdate(id, {
                    $push: {
                        listen: {
                            $each: [
                                {
                                    time: cTimeRound,
                                    hour: hours.toString(),
                                    counter: 1,
                                },
                            ],
                            $position: 0,
                        },
                    },
                });
            }

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
}

module.exports = new SongController();
