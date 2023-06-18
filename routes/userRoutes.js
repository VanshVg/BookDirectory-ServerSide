const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/displayUsers", userController.show);
router.get("/profile", userController.profile);
router.get("/verifypassword", userController.checkPassword);
router.put("/changepassword", userController.newPassword);

module.exports = router;
