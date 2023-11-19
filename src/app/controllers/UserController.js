const User = require("../models/User");
const shortid = require("shortid");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
};
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "365d" }
    );
};

class UserController {
    // [POST] /api/v1/user/login
    async login(req, res, next) {
        const { username, password } = req.body;

        if (!username) {
            return res
                .status(400)
                .json({ success: false, message: "Username is required" });
        }
        if (!password) {
            return res
                .status(400)
                .json({ success: false, message: "Password is required" });
        }

        try {
            let user = await User.findOne({ username });
            if (!user) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Incorrect username or password",
                    });
            }

            const passwordValid = await argon2.verify(user.password, password);
            if (!passwordValid) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Incorrect username or password",
                    });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            // Lưu refreshToken vào database
            user = await User.findByIdAndUpdate(
                user._id,
                { refreshToken },
                { new: true }
            ).select(
                "-password -refreshToken -createDate -updateDate -playlistHistory -songHistory -songFavourite -artistFollow -albumFavourite -playlistFavourite"
            );

            res.status(200).json({
                success: true,
                user,
                accessToken,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/user/create
    async register(req, res, next) {
        const { name, username, password } = req.body;

        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "Name is required" });
        }
        if (!username) {
            return res
                .status(400)
                .json({ success: false, message: "Username is required" });
        }
        if (!password) {
            return res
                .status(400)
                .json({ success: false, message: "Password is required" });
        }

        try {
            const user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken",
                });
            }

            const hashedPassword = await argon2.hash(password);

            let newUser = new User({
                ...req.body,
                password: hashedPassword,
            });

            await newUser.save();

            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            // Lưu refreshToken vào database
            newUser = await User.findByIdAndUpdate(
                newUser._id,
                { refreshToken },
                { new: true }
            ).select("-password");

            res.status(200).json({
                success: true,
                user: newUser,
                accessToken,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [GET] /api/v1/user/:id
    async getSingleUser(req, res, next) {
        try {
            const user = await User.findById(req.params.id).select("-password");

            if (!user) {
                return res
                    .status(400)
                    .json({ success: false, message: "User not found" });
            }

            res.json({ success: true, user });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    // [POST] /api/v1/user/refresh
    async requestRefreshToken(req, res, next) {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json("You're not authenticated");
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

            const user = await User.findOne({ _id: decoded.id, refreshToken });

            if (user) {
                const accessToken = generateAccessToken(user);

                return res.status(200).json({ success: true, accessToken });
            } else {
                return res.status(403).json({ success: false });
            }
        } catch (error) {
            console.log(error);
            return res
                .status(403)
                .json({ success: false, message: "Invalid token" });
        }
    }

    // [POST] /api/v1/user/logout
    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return res.status(401).json("You're not authenticated");
            }

            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
            const userId = decoded.id;

            const rs = await User.findOneAndUpdate(
                { refreshToken: refreshToken },
                { refreshToken: "" },
                { new: true }
            );

            if (rs) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                });
                return res.status(200).json({ success: true });
            }
        } catch (error) {
            return res.status(400).json({ success: false });
        }
    }

    // [GET] /api/v1/user/check
    async checkUser(req, res, next) {
        try {
            const user = await User.findById(req.id).select("-password");

            if (!user) {
                return res
                    .status(400)
                    .json({ success: false, message: "User not found" });
            }
            return res.json({ success: true, user });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/user/create
    async create(req, res, next) {
        try {
            const user = new User({
                ...req.body,
                createDate: Date.now(),
            });

            await user.save();

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/user/find
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
            const user = await User.find({
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    {
                        title: {
                            $regex: new RegExp(search?.replace(/ /g, "-"), "i"),
                        },
                    },
                ],
            })
                .select("-password")
                .sort(sort)
                .limit(limit)
                .skip(skip);

            const totalUser = await User.find({
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
            const totalAddToday = await User.find({
                createDate: { $gte: today },
            }).count();

            res.status(200).json({
                success: true,
                user,
                totalUser,
                totalAddToday,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [POST] /api/v1/user/delete
    async delete(req, res, next) {
        try {
            const { listId } = req.body;

            listId.map(async (id) => {
                const resDelete = await User.findByIdAndDelete(id);

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

    // [GET] /api/v1/user/getSingle/:id
    async getSingle(req, res, next) {
        try {
            const id = req.params.id;

            const user = await User.findById(id).select("-password");

            return res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // [PUT] /api/v1/user/update/:id
    async update(req, res, next) {
        try {
            const id = req.params.id;

            const user = await User.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    updateDate: Date.now(),
                },
                { new: true }
            ).select("-password");

            return res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }
}

module.exports = new UserController();
