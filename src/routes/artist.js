const express = require("express");
const router = express.Router();

const artistController = require("../app/controllers/ArtistController");

router.post("/create", artistController.create);

module.exports = router;