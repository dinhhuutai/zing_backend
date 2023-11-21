const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const pageAlbumController = require("../app/controllers/PageAlbumController");

router.get("/getSingle/:id", pageAlbumController.getSingle);

module.exports = router;