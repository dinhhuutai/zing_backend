const express = require("express");
const router = express.Router();
const uploadCloud = require('../middleware/uploader');
const uploadCloudMusic = require('../middleware/uploaderMusic');

const cloudController = require("../app/controllers/CloudController");

router.post("/uploadimg", 
uploadCloud.fields([
    { name: "image", maxCount: 1 },
]), cloudController.createImg);

router.post("/uploadmusic", uploadCloudMusic.single('music'), cloudController.createMusic);

module.exports = router;