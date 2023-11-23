const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const pageAlbumController = require("../app/controllers/PageAlbumController");

router.get("/getSingle/:id", pageAlbumController.getSingle);
router.put("/like/:idAlbum", verifyToken, pageAlbumController.like);
router.put("/unlike/:idAlbum", verifyToken, pageAlbumController.unlike);
router.put("/historyPlaylist/:idAlbum", verifyToken, pageAlbumController.historyPlaylist);

module.exports = router;