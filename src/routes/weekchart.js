const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const weekchartController = require("../app/controllers/WeekchartController");

router.post("/create", verifyToken, weekchartController.create);
router.post("/find", verifyToken, weekchartController.find);
router.post("/delete", verifyToken, weekchartController.delete);
router.get("/getSingle/:id", weekchartController.getSingle);
router.put("/update/:id", weekchartController.update);
router.get("/getAll", weekchartController.getAll);

module.exports = router;