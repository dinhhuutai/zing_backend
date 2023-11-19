const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const playListController = require("../app/controllers/PlaylistController");


router.post("/create", verifyToken, playListController.create);
router.post("/find", playListController.find);
router.post("/delete", verifyToken, playListController.delete);
router.get("/getSingle/:id", playListController.getSingle);
router.put("/update/:id", playListController.update);


module.exports = router;