const express = require("express");
const cartController = require("../controller/cartController");

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.post("/addtocart/:id", cartController.add);
router.get("/cartbooks", cartController.show);
router.delete("/removecart/:id", cartController.remove);
router.put("/addquantity/:id", cartController.addQuantity);
router.put("/removequantity/:id", cartController.removeQuantity);

module.exports = router;
