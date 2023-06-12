const express = require("express");
const bookController = require("../controller/bookController");

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const bookRoutes = (upload) => {
  router.post("/addBook", upload.single("image"), bookController.add);
  router.get("/showBooks", bookController.show);
  router.get("/showBook/:id", bookController.showOne);
  router.get("/sortAuthor", bookController.sortAuthor);
  router.delete("/removeBook/:id", bookController.remove);
  router.put("/updateBook/:id", bookController.update);

  return router;
};

module.exports = bookRoutes;
