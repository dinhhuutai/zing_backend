

class CloudController {
    // [POST] /api/v1/cloudinary/uploadimg
    async create(req, res, next) {

        try {
            
            res.status(200).json({
                success: true,
                link: req.files.image[0].path,
            });

        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

}

module.exports = new CloudController();
