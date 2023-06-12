const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId: String,
  bookId: String,
  title: String,
  isbn: Number,
  pages: Number,
  author: String,
  price: Number,
  imageUrl: String,
  quantity: Number,
  genre: Array,
});

module.exports = mongoose.model("cartdatas", cartSchema);
