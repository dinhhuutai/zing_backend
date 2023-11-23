const Playlist = require("../models/playlist");
const User = require("../models/User");
const Song = require("../models/Song");
const Genre = require("../models/Genre");
const Weekchart = require("../models/Weekchart");
const Album = require("../models/Album");
const Partner = require("../models/Partner");

class PageExploreController {
    // [GET] /api/v1/page/explore/get?ctime=
    async get(req, res, next) {
        try {
            const getSlider = async () => {
                const res = await Playlist.aggregate([
                    { $match: { isBanner: true } },
                    { $sample: { size: 3 } },
                ]);

                return {
                    sectionType: "banner",
                    title: "",
                    items: res,
                };
            };
            const slider = await getSlider();

            const getNewRelease = async () => {
                const genreIdVietNam = await Genre.findOne({
                    alias: "nhac-viet",
                });

                const resAll = await Song.find()
                    .populate("artists")
                    .sort({ createDate: -1 })
                    .limit(12);

                const resVN = await Song.find({
                    genreId: { $in: genreIdVietNam._id },
                })
                    .populate("artists")
                    .sort({ createDate: -1 })
                    .limit(12);

                const resQt = await Song.find({
                    genreId: { $nin: genreIdVietNam._id },
                })
                    .populate("artists")
                    .sort({ createDate: -1 })
                    .limit(12);

                return {
                    sectionType: "newRelease",
                    title: "Mới phát hành",
                    items: {
                        all: resAll,
                        vn: resVN,
                        qt: resQt,
                    },
                };
            };
            const newRelease = await getNewRelease();

            const getChill = async () => {
                const genreIdChill = await Genre.findOne({ alias: "chill" });
                const genreIdTop100 = await Genre.findOne({ alias: "top-100" });

                const res = await Playlist.aggregate([
                    {
                        $match: {
                            genreId: {
                                $elemMatch: {
                                    $eq: genreIdChill._id,
                                    $ne: genreIdTop100._id,
                                },
                            },
                            onlyArtist: false,
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

                return {
                    sectionType: "playlist",
                    title: "chill",
                    items: res,
                };
            };
            const chill = await getChill();

            const getLoveInLife = async () => {
                const genreIdLoveInLife = await Genre.findOne({
                    alias: "khuc-nhac-vui",
                });
                const genreIdTop100 = await Genre.findOne({ alias: "top-100" });

                const res = await Playlist.aggregate([
                    {
                        $match: {
                            genreId: {
                                $elemMatch: {
                                    $eq: genreIdLoveInLife._id,
                                    $ne: genreIdTop100._id,
                                },
                            },
                            onlyArtist: false,
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

                return {
                    sectionType: "playlist",
                    title: "Một chút yêu đời",
                    items: res,
                };
            };
            const loveInLife = await getLoveInLife();

            const getRemix = async () => {
                const genreIdRemix = await Genre.findOne({ alias: "remix" });
                const genreIdTop100 = await Genre.findOne({ alias: "top-100" });

                const res = await Playlist.aggregate([
                    {
                        $match: {
                            genreId: {
                                $elemMatch: {
                                    $eq: genreIdRemix._id,
                                    $ne: genreIdTop100._id,
                                },
                            },
                            onlyArtist: false,
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

                return {
                    sectionType: "playlist",
                    title: "Remix là Dance luôn",
                    items: res,
                };
            };
            const remix = await getRemix();

            const getSlowly = async () => {
                const genreIdSlowly = await Genre.findOne({
                    alias: "giai-dieu-buon",
                });
                const genreIdTop100 = await Genre.findOne({ alias: "top-100" });

                const res = await Playlist.aggregate([
                    {
                        $match: {
                            genreId: {
                                $elemMatch: {
                                    $eq: genreIdSlowly._id,
                                    $ne: genreIdTop100._id,
                                },
                            },
                            onlyArtist: false,
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

                return {
                    sectionType: "playlist",
                    title: "Tâm trạng tan chậm",
                    items: res,
                };
            };
            const slowly = await getSlowly();

            const getOnlyArtist = async () => {
                const res = await Playlist.aggregate([
                    { $match: { onlyArtist: true } },
                    { $sample: { size: 5 } },
                ]);

                return {
                    sectionType: "playlist",
                    title: "Nghệ sĩ thịnh hành",
                    items: res,
                };
            };
            const onlyArtist = await getOnlyArtist();

            const getBxhSongNew = async () => {
                const endDate = new Date(); // Ngày hiện tại
                const startDate = new Date(
                    endDate.getTime() - 7 * 24 * 60 * 60 * 1000
                ); // Ngày trước đó 1 tuần

                let resTemp;
                let res = await Song.find()
                    .sort({ totalListen: -1 })
                    .limit(8)
                    .populate("artists");

                if (res.length < 8) {
                    resTemp = await Song.find({
                        createDate: { $gte: startDate },
                    })
                        .sort({ createDate: -1 })
                        .limit(20);

                    resTemp = await resTemp
                        .find({
                            createDate: { $gte: startDate },
                        })
                        .sort({ totalListen: -1 })
                        .limit(8);

                    const sl = 8 - res.length;
                    res.concat(resTemp.slice(0, sl));
                }

                return {
                    sectionType: "newReleaseChart",
                    title: "BXH Nhạc Mới",
                    items: res,
                };
            };
            const bxhSongNew = await getBxhSongNew();

            const getWeekchart = async () => {
                const res = await Weekchart.find().limit(3);

                return {
                    sectionType: "weekchart",
                    title: "",
                    items: res,
                };
            };
            const weekchart = await getWeekchart();

            const getTop100 = async () => {
                const genreIdTop100 = await Genre.findOne({ alias: "top-100" });

                const res = await Playlist.aggregate([
                    {
                        $match: {
                            genreId: { $elemMatch: { $eq: genreIdTop100._id } },
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

                return {
                    sectionType: "playlist",
                    title: "Top 100",
                    items: res,
                };
            };
            const top100 = await getTop100();

            const getAlbum = async () => {
                const res = await Album.aggregate([
                    {
                        $addFields: {
                            likeCount: { $size: "$like.items" }, // Đếm số lượng items trong mảng like.items
                        },
                    },
                    {
                        $sort: { likeCount: -1 }, // Sắp xếp theo số lượt nghe giảm dần
                    },
                    {
                        $limit: 5, // Giới hạn kết quả chỉ trả về 5 album
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
                ]);

                return {
                    sectionType: "playlist",
                    title: "Album Hot",
                    items: res,
                };
            };
            const album = await getAlbum();

            const getPartner = async () => {
                const res = await Partner.find().limit(16);

                return {
                    title: "Đối tác âm nhạc",
                    items: res,
                };
            };
            const partner = await getPartner();

            const cTime = req.query?.ctime;
            const getRTChart = async () => {
                const currentDate = new Date(cTime * 1000); // Tạo đối tượng Date từ mili giây
                const hours = currentDate.getHours(); // Lấy giờ từ đối tượng Date
                const day = currentDate.getDate(); // Lấy ngày từ đối tượng Date
                const month = currentDate.getMonth(); // Lấy tháng từ đối tượng Date (chú ý: tháng bắt đầu từ 0)
                const year = currentDate.getFullYear(); // Lấy năm từ đối tượng Date

                let cTimeRound = new Date(year, month, day, hours, 0, 0);
                cTimeRound = cTimeRound.getTime() / 1000;

                let arrayTemp = [];

                for (let i = 0; i < 24; i++) {
                    const item = {
                        time: cTimeRound - i * (60 * 60),
                        hour: (hours - i >= 0
                            ? hours - i
                            : 24 + hours - i
                        ).toString(),
                        counter: 0,
                    };

                    arrayTemp.unshift(item);
                }

                const res = await Song.aggregate([
                    {
                        $addFields: {
                            totalCounter: {
                                $sum: {
                                    $map: {
                                        input: "$listen",
                                        as: "listenItem",
                                        in: {
                                            $cond: {
                                                if: {
                                                    $gte: [
                                                        {
                                                            $toDate: {
                                                                $multiply: [
                                                                    "$$listenItem.time",
                                                                    1000,
                                                                ],
                                                            },
                                                        },
                                                        new Date(
                                                            (cTimeRound -
                                                                24 * 60 * 60) *
                                                                1000
                                                        ),
                                                    ],
                                                },
                                                then: "$$listenItem.counter",
                                                else: 0,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "artists", // Tên bảng cần join
                            localField: "artists",
                            foreignField: "_id",
                            as: "artists", // Tên trường sẽ chứa thông tin user
                        },
                    },
                    {
                        $sort: { totalCounter: -1 }, // Sắp xếp theo giảm dần của totalCounter
                    },
                    {
                        $limit: 3, // Giới hạn kết quả chỉ trả về 5 album
                    },
                ]);

                function removeDuplicates(arr) {
                    const result = [];

                    for (let i = 0; i < arr.length; i++) {
                        // Nếu phần tử chưa tồn tại trong mảng kết quả, thêm nó vào
                        if (!result.some(item => item.time === arr[i].time)) {
                            result.push(arr[i]);
                        } else if(result[result.length - 1].counter < arr[i].counter) {
                            result[result.length - 1] = arr[i];
                        }
                    }

                    return result;
                }

                const items = {
                    [res[0].encodeId]: removeDuplicates(arrayTemp
                        .map((item) =>
                            res[0].listen.length > 0
                                ? res[0].listen.map((it) =>
                                      it.time === item.time
                                          ? { ...it, time: it.time * 1000 }
                                          : { ...item, time: item.time * 1000 }
                                  )
                                : { ...item, time: item.time * 1000 }
                        )
                        .flat()),
                    [res[1].encodeId]: removeDuplicates(arrayTemp
                        .map((item) =>
                            res[1].listen.length > 0
                                ? res[1].listen.map((it) =>
                                      it.time === item.time
                                          ? { ...it, time: it.time * 1000 }
                                          : { ...item, time: item.time * 1000 }
                                  )
                                : { ...item, time: item.time * 1000 }
                        )
                        .flat()),
                    [res[2].encodeId]: removeDuplicates(arrayTemp
                        .map((item) =>
                            res[2].listen.length > 0
                                ? res[2].listen.map((it) =>
                                      it.time === item.time
                                          ? { ...it, time: it.time * 1000 }
                                          : { ...item, time: item.time * 1000 }
                                  )
                                : { ...item, time: item.time * 1000 }
                        )
                        .flat()),
                };

                const RTChart = {
                    items: res,
                };

                return {
                    sectionType: "RTChart",
                    title: "",
                    items,
                    RTChart,
                };
            };
            const rtChart = await getRTChart();

            res.status(200).json({
                success: true,
                items: {
                    slider,
                    newRelease,
                    chill,
                    loveInLife,
                    remix,
                    slowly,
                    onlyArtist,
                    bxhSongNew,
                    weekchart,
                    top100,
                    album,
                    partner,
                    rtChart,
                },
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }
}

module.exports = new PageExploreController();
