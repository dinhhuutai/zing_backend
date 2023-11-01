const express = require("express");
const router = express.Router();

const genreController = require("../app/controllers/GenreController");

router.post("/create", genreController.create);

module.exports = router;