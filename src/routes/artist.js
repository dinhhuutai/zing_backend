const express = require("express");
const router = express.Router();
const uploadCloud = require('../middleware/uploader');

const artistController = require("../app/controllers/ArtistController");

router.post("/create", artistController.create);

module.exports = router;