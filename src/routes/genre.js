const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const genreController = require("../app/controllers/GenreController");

router.post("/create", verifyToken, genreController.create);
router.post("/find", verifyToken, genreController.find);
router.post("/delete", verifyToken, genreController.delete);
router.get("/getSingle/:id", genreController.getSingle);
router.put("/update/:id", genreController.update);
router.get("/getAll", genreController.getAll);

module.exports = router;