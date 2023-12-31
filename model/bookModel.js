const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  bookId: String,
  title: String,
  isbn: Number,
  pages: Number,
  author: String,
  price: Number,
  imageUrl: String,
  description: String,
  genre: Array,
});

module.exports = mongoose.model("books", bookSchema);
