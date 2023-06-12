const express = require("express");
const multer = require("multer");
const bookRoute = require("./routes/bookRoutes");
const userRoute = require("./routes/userRoutes");
const cartRoute = require("./routes/cartRoutes");
const path = require("path");
require("./config/db");

const app = express();

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

console.log(path.join(__dirname));
app.use("/api", bookRoute(upload));
app.use("/api", userRoute);
app.use("/api", cartRoute);

app.listen(4000, () => {
  console.log("Server is listening at 4000");
});
