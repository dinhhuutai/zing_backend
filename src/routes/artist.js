const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const artistController = require("../app/controllers/ArtistController");

router.post("/create", verifyToken, artistController.create);
router.post("/find", verifyToken, artistController.find);
router.post("/delete", verifyToken, artistController.delete);
router.get("/getSingle/:id", artistController.getSingle);
router.put("/update/:id", artistController.update);
router.get("/getAll", artistController.getAll);

module.exports = router;