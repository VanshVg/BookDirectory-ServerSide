const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URL;

module.exports = mongoose.connect(url);
