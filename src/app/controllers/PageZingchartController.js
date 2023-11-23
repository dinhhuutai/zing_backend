const Playlist = require("../models/playlist");
const User = require("../models/User");
const Song = require("../models/Song");
const Genre = require("../models/Genre");
const Weekchart = require("../models/Weekchart");
const Album = require("../models/Album");
const Partner = require("../models/Partner");

class PageZingchartController {
    // [GET] /api/v1/page/zingchart/get?ctime=
    async get(req, res, next) {
        try {

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

module.exports = new PageZingchartController();
