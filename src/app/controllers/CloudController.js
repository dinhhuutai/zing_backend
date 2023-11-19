const cloudinary = require("cloudinary").v2;

class CloudController {
    // [POST] /api/v1/cloudinary/uploadimg
    async createImg(req, res, next) {
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

    // [POST] /api/v1/cloudinary/uploadmusic
    async createMusic(req, res, next) {
        try {
            // Tải lên tệp MP3 lên Cloudinary
            const result = await cloudinary.uploader
                .upload_stream(
                    { resource_type: "auto", folder: process.env.FOLDER_CLOUD },
                    (error, result) => {
                        if (error) {
                            console.error(error);
                            res.status(500).json({ success: false, error: "Upload failed" });
                        } else {
                            res.status(200).json({ success: true, url: result.url });
                        }
                    }
                )
                .end(req.file.buffer);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: "Upload failed" });
        }
    }
}

module.exports = new CloudController();
