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
  router.get("/showbook/:id", bookController.showOne);
  router.get("/sortauthor", bookController.sortAuthor);
  router.delete("/removebook/:id", bookController.remove);
  router.put("/updatebook/:id", upload.single("image"), bookController.update);
  router.get("/books/:value", bookController.filterBooks);

  return router;
};

module.exports = bookRoutes;
