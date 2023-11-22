const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const songController = require("../app/controllers/SongController");


router.post("/create", verifyToken, songController.create);
router.post("/find", verifyToken, songController.find);
router.post("/delete", verifyToken, songController.delete);
router.get("/getSingle/:id", songController.getSingle);
router.put("/update/:id", songController.update);
router.get("/getAll", songController.getAll);

router.put("/listen/:id", songController.listen);


module.exports = router;