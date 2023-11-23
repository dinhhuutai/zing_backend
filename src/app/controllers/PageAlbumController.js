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
            let playlist = await Playlist.findByIdAndUpdate(
                idAlbum,
                { $addToSet: { like: req.id } },
                { new: true }
            );

            if (!playlist) {
                playlist = await Album.findByIdAndUpdate(
                    idAlbum,
                    { $addToSet: { like: req.id } },
                    { new: true }
                );
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
            let playlist = await Playlist.findByIdAndUpdate(
                idAlbum,
                { $pull: { like: req.id } },
                { new: true }
            );

            if (!playlist) {
                playlist = await Album.findByIdAndUpdate(
                    idAlbum,
                    { $pull: { like: req.id } },
                    { new: true }
                );
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

    // [PUT] /api/v1/page/album/historyPlaylist/:idAlbum
    async historyPlaylist(req, res, next) {
        try {
            const idAlbum = req.params.idAlbum;
            let playlist = await Playlist.findById(idAlbum);

            if (playlist) {
                playlist = await User.findByIdAndUpdate(
                    req.id,
                    {
                        $push: {
                            playlistHistory: {
                                $each: [idAlbum],
                                $position: 0, // Đặt vị trí là 0 để thêm vào đầu mảng
                            },
                        },
                    },
                    { new: true }
                );

                const historyPlaylist = playlist.playlistHistory;

                
                function removeDuplicates(arr) {
                    const result = [];

                    for (let i = 0; i < arr.length; i++) {
                        // Nếu phần tử chưa tồn tại trong mảng kết quả, thêm nó vào
                        if (!result.some(item => item.toString() === arr[i].toString())) {
                            result.push(arr[i]);
                        }
                    }

                    return result;
                }

                const historyPlaylistNew = removeDuplicates(historyPlaylist);

                playlist = await User.findByIdAndUpdate(
                    req.id,
                    {
                        playlistHistory: historyPlaylistNew
                    },
                    { new: true }
                );

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
