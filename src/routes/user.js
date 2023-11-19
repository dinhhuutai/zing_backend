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


router.post("/create", verifyToken, userController.create);
router.post("/find", userController.find);
router.post("/delete", verifyToken, userController.delete);
router.get("/getSingle/:id", userController.getSingle);
router.put("/update/:id", userController.update);

module.exports = router;