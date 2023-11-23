const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const pageZingchartController = require("../app/controllers/PageZingchartController");

router.get("/get", pageZingchartController.get);

module.exports = router;