const express = require("express");
const router = express.Router();
const uploadCloud = require('../middleware/uploader');

const cloudController = require("../app/controllers/CloudController");

router.post("/uploadimg", 
uploadCloud.fields([
    { name: "image", maxCount: 1 },
]), cloudController.create);

module.exports = router;