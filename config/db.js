const mongoose = require("mongoose");

const url =
  "mongodb+srv://vanshvg:Vansh1712@socialmedia.xqmcctb.mongodb.net/bookDirectory";

module.exports = mongoose.connect(url);
