const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_DB_URL;
module.exports = mongoose.connect(url);
