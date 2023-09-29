const express = require("express");
const router = express.Router();

const songController = require("../../app/controllers/user/SongController");

router.get("/:id", songController.show);
router.post("/create", songController.create);
router.put("/update/:id", songController.update);
router.delete("/delete/:id", songController.delete);

module.exports = router;