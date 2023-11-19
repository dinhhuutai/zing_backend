const Weekchart = require("../models/Weekchart");
const shortid = require('shortid');


class WeekchartController {
    // [POST] /api/v1/weekchart/create
    async create(req, res, next) {

        try {


            const weekchart = new Weekchart({
                ...req.body,
                alias: req.body.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                createDate: Date.now(),
            });

            await weekchart.save();

            
            res.status(200).json({
                success: true,
                weekchart,
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

    // [POST] /api/v1/weekchart/find
    async find(req, res, next) {
        const limit = req.query.limit;
        const skip = req.query.skip;
        const search = req?.query?.search;

        const name = Number(req?.query?.sortName);
        const createDate = Number(req?.query?.sortCreateDate);
        const updateDate = Number(req?.query?.sortContentLastUpdate);

        let sort = {};
        if (name === 1 || name === -1) {
            sort = { name: name };
        } else if (createDate === 1 || createDate === -1) {
            sort = { createDate: createDate };
        } else if (updateDate === 1 || updateDate === -1) {
            sort = { updateDate: updateDate };
        }

        try {
            const weekchart = await Weekchart.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    { alias: { $regex: new RegExp(search?.replace(/ /g, "-"), "i") } },
                ],
            })
                .sort(sort)
                .limit(limit)
                .skip(skip);
                
            const totalWeekchart = await Weekchart.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    { alias: { $regex: new RegExp(search?.replace(/ /g, "-"), "i") } },
                ],
            }).count();

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const totalAddToday = await Weekchart.find(
                { createDate: { $gte: today } },
            ).count();

            res.status(200).json({
                success: true,
                weekchart,
                totalWeekchart,
                totalAddToday,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/weekchart/delete
    async delete(req, res, next) {
        try {
            const { listId } = req.body;

            listId.map(async (id) => {
                const resDelete = await Weekchart.findByIdAndDelete(id);

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

    // [GET] /api/v1/weekchart/getSingle/:id
    async getSingle(req, res, next) {
        try {
            const id = req.params.id;

            const weekchart = await Weekchart.findById(id);

            return res.status(200).json({
                success: true,
                weekchart,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [PUT] /api/v1/weekchart/update/:id
    async update(req, res, next) {
        try {
            const id = req.params.id;

            const weekchart = await Weekchart.findByIdAndUpdate(
                id,
                { 
                    ...req.body,
                    alias: req.body.name
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
                weekchart,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }


    // [GET] /api/v1/weekchart/getAll?search=
    async getAll(req, res, next) {
        try {
            const search = req?.query?.search;

            const weekchart = await Weekchart.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    { alias: { $regex: new RegExp(search?.replace(/ /g, "-"), "i") } },
                ],
            }).sort({name: 1});


            return res.status(200).json({
                success: true,
                weekchart,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

}

module.exports = new WeekchartController();
