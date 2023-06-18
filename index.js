const express = require("express");
const multer = require("multer");
const bodyparser = require("body-parser");
const cors = require("cors");
const bookRoute = require("./routes/bookRoutes");
const userRoute = require("./routes/userRoutes");
const cartRoute = require("./routes/cartRoutes");
const path = require("path");
const mongoose = require("mongoose");
require("./config/db");

mongoose.connection.once("open", function () {
  console.log("Mongodb is connected");
});
mongoose.connection.on("disconnected", function () {
  console.log("Mongodb is disconnected");
});

const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/images"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${req.body.isbn}-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "public/images")));

app.use("/api", bookRoute(upload));
app.use("/api", userRoute);
app.use("/api", cartRoute);

app.listen(4000, () => {
  console.log("Server is listening at 4000");
});
