const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const albumController = require("../app/controllers/AlbumController");


router.post("/create", verifyToken, albumController.create);
router.post("/find", albumController.find);
router.post("/delete", verifyToken, albumController.delete);
router.get("/getSingle/:id", albumController.getSingle);
router.put("/update/:id", albumController.update);


module.exports = router;