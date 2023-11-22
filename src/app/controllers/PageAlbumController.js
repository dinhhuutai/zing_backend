const Playlist = require("../models/playlist");
const User = require("../models/User");
const Song = require("../models/Song");
const Genre = require("../models/Genre");
const Weekchart = require("../models/Weekchart");
const Album = require("../models/Album");
const Partner = require("../models/Partner");

class PageAlbumController {
    // [GET] /api/v1/page/album/getSingle/:id
    async getSingle(req, res, next) {
        try {
            const id = req.params.id;
            let playlist;
            let artists;
            let playlistFollow;

            playlist = await Playlist.findById(id)
                .populate({
                    path: "songs",
                    populate: {
                        path: "artists",
                    },
                })
                .populate("genreId");

            if (!playlist) {
                playlist = await Album.findById(id)
                    .populate({
                        path: "songs",
                        populate: {
                            path: "artists",
                        },
                    })
                    .populate("genreId");

                artists = await Album.aggregate([
                    {
                        $match: {
                            _id: playlist._id,
                        },
                    },
                    {
                        $lookup: {
                            from: "songs", // Tên của collection bạn muốn join
                            localField: "songs", // Trường trong collection hiện tại để join
                            foreignField: "_id", // Trường trong collection khác để join
                            as: "songs", // Tên của trường mới trong documents kết quả để chứa thông tin từ collection khác
                        },
                    },
                    {
                        $lookup: {
                            from: "artists",
                            localField: "songs.artists",
                            foreignField: "_id",
                            as: "artists",
                        },
                    },
                    {
                        $project: {
                            artists: "$artists",
                        },
                    },
                ]);

                playlistFollow = await Album.aggregate([
                    {
                        $match: {
                            genreId: {
                                $elemMatch: {
                                    $in: playlist.genreId,
                                },
                            },
                            _id: { $ne: playlist._id },
                        },
                    },
                    { $sample: { size: 5 } },
                    {
                        $lookup: {
                            from: "songs", // Tên của collection bạn muốn join
                            localField: "songs", // Trường trong collection hiện tại để join
                            foreignField: "_id", // Trường trong collection khác để join
                            as: "songs", // Tên của trường mới trong documents kết quả để chứa thông tin từ collection khác
                        },
                    },
                    {
                        $lookup: {
                            from: "artists",
                            localField: "songs.artists",
                            foreignField: "_id",
                            as: "artists",
                        },
                    },
                ]);
            } else {
                artists = await Playlist.aggregate([
                    {
                        $match: {
                            _id: playlist._id,
                        },
                    },
                    {
                        $lookup: {
                            from: "songs", // Tên của collection bạn muốn join
                            localField: "songs", // Trường trong collection hiện tại để join
                            foreignField: "_id", // Trường trong collection khác để join
                            as: "songs", // Tên của trường mới trong documents kết quả để chứa thông tin từ collection khác
                        },
                    },
                    {
                        $lookup: {
                            from: "artists",
                            localField: "songs.artists",
                            foreignField: "_id",
                            as: "artists",
                        },
                    },
                    {
                        $project: {
                            artists: "$artists",
                        },
                    },
                ]);

                playlistFollow = await Playlist.aggregate([
                    {
                        $match: {
                            genreId: {
                                $elemMatch: {
                                    $in: playlist.genreId,
                                },
                            },
                            _id: { $ne: playlist._id },
                        },
                    },
                    { $sample: { size: 5 } },
                    {
                        $lookup: {
                            from: "songs", // Tên của collection bạn muốn join
                            localField: "songs", // Trường trong collection hiện tại để join
                            foreignField: "_id", // Trường trong collection khác để join
                            as: "songs", // Tên của trường mới trong documents kết quả để chứa thông tin từ collection khác
                        },
                    },
                    {
                        $lookup: {
                            from: "artists",
                            localField: "songs.artists",
                            foreignField: "_id",
                            as: "artists",
                        },
                    },
                ]);
            }

            res.status(200).json({
                success: true,
                items: {
                    playlist,
                    artists: artists[0].artists,
                    playlistFollow,
                },
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    
    // [PUT] /api/v1/page/album/like/:idAlbum
    async like(req, res, next) {
        try {
            const idAlbum = req.params.idAlbum;
            let playlist = await Playlist.findByIdAndUpdate(idAlbum, { $addToSet: { like: req.id } }, {new: true});

            if(!playlist) {
                playlist = await Album.findByIdAndUpdate(idAlbum, { $addToSet: { like: req.id } }, {new: true});
            }

            
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

    
    // [PUT] /api/v1/page/album/unlike/:idAlbum
    async unlike(req, res, next) {
        try {
            const idAlbum = req.params.idAlbum;
            let playlist = await Playlist.findByIdAndUpdate(idAlbum, { $pull: { like: req.id } }, {new: true});

            if(!playlist) {
                playlist = await Album.findByIdAndUpdate(idAlbum, { $pull: { like: req.id } }, {new: true});
            }

            
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

module.exports = new PageAlbumController();
