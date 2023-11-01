const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const userController = require("../app/controllers/UserController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/check", verifyToken, userController.checkUser);
router.get("/:id", verifyToken, userController.getSingleUser);
router.post("/refresh", userController.requestRefreshToken);
router.post("/logout", verifyToken, userController.logout);

module.exports = router;