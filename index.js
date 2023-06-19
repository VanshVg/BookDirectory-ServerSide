const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
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

app.use(express.static(path.join(__dirname, "public/images")));

app.use("/api", bookRoute);
app.use("/api", userRoute);
app.use("/api", cartRoute);

app.listen(4000, () => {
  console.log("Server is listening at 4000");
});
