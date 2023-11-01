const express = require("express");
const router = express.Router();

const songController = require("../app/controllers/SongController");

router.get("/all", songController.getSongs);
router.get("/:id", songController.getSingleSong);
router.post("/create", songController.create);
router.put("/update/:id", songController.update);
router.delete("/delete/:id", songController.delete);

module.exports = router;