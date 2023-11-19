const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const partnerController = require("../app/controllers/PartnerController");

router.post("/create", verifyToken, partnerController.create);
router.post("/find", verifyToken, partnerController.find);
router.post("/delete", verifyToken, partnerController.delete);
router.get("/getSingle/:id", partnerController.getSingle);
router.put("/update/:id", partnerController.update);
router.get("/getAll", partnerController.getAll);

module.exports = router;