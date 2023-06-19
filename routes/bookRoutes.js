const express = require("express");
const multer = require("multer");
const path = require("path");

const bookController = require("../controller/bookController");

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post("/addBook", upload.single("image"), bookController.add);
router.get("/showBooks", bookController.show);
router.get("/showbook/:id", bookController.showOne);
router.get("/search", bookController.search);
router.delete("/removebook/:id", bookController.remove);
router.put("/updatebook/:id", upload.single("image"), bookController.update);
router.get("/books/:value", bookController.filterBooks);
router.post("/processpayment", bookController.payment);

module.exports = router;
