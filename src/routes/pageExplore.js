const express = require("express");
const router = express.Router();

const pageExploreController = require("../app/controllers/PageExploreController");

router.get("/get", pageExploreController.get);

module.exports = router;