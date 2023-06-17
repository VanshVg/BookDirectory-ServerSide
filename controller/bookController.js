const e = require("express");
const bookModel = require("../model/bookModel");
const { v4: uuidv4 } = require("uuid");

const add = async (req, resp) => {
  let imageUrl = "";
  let newBookId = uuidv4();

  if (req.file) {
    imageUrl = `http://localhost:4000/${req.file.filename}`;
  }

  const genres = req.body.genre.split(",").map((genre) => genre.trim());

  let data = new bookModel({
    bookId: newBookId,
    title: req.body.title,
    isbn: req.body.isbn,
    pages: req.body.pages,
    author: req.body.author,
    price: req.body.price,
    imageUrl: imageUrl,
    description: req.body.description,
    genre: genres,
  });

  const book = await bookModel.findOne({ isbn: req.body.isbn });
  if (book) {
    resp.status(400).send({
      message: "Book already exists",
    });
  } else {
    let result = await data.save();
    resp.status(200).send({ result });
  }
};

const show = async (req, resp) => {
  let data = await bookModel.find();
  resp.status(200).send({ data });
};

const showOne = async (req, resp) => {
  const bookId = req.params.id;
  let book = await bookModel.findOne({ bookId: bookId });
  if (book) {
    resp.status(200).send({ book });
  } else {
    resp.status(404).send({
      message: "Book doesn't exist",
    });
  }
};

const remove = async (req, resp) => {
  const bookId = req.params.id;
  console.log(bookId);
  let deleteBook = await bookModel.find({ bookId: bookId });
  deleteBook = 1;
  if (deleteBook.length == 0) {
    resp.status(404).send({
      message: "This book doesn't exist",
    });
  } else {
    await bookModel.deleteOne({ bookId: bookId });
    resp.status(200).send({
      message: "Book successfully removed",
    });
    console.log("Book successfully removed");
  }
};

const update = async (req, res) => {
  const bookId = req.params.id;
  try {
    let book = await bookModel.findOne({ bookId: bookId });
    if (!book) {
      return res.status(404).send({
        message: "Book doesn't exist",
      });
    }

    let imageUrl = book.imageUrl;

    if (req.file) {
      imageUrl = `http://localhost:4000/${req.file.filename}`;
    }

    await bookModel.updateOne(
      { bookId: bookId },
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          genre: req.body.genre,
          pages: req.body.pages,
          isbn: req.body.isbn,
          price: req.body.price,
          imageUrl: imageUrl,
        },
      }
    );

    res.status(200).send({
      message: "Book updated",
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).send({
      message: "Error updating book",
      error: error.message,
    });
  }
};

const sortAuthor = async (req, resp) => {
  let data = await bookModel.find({ author: req.body.author });
  resp.status(200).send({ data });
  console.log({ data });
};

const filterBooks = async (req, resp) => {
  const value = req.params.value;
  console.log(value);
  const books = await bookModel.find({
    genre: { $regex: value, $options: "i" },
  });
  if (books) {
    resp.status(200).send({ books });
  } else {
    resp.status(404).send({ message: "No books found" });
  }
};

module.exports = {
  add,
  show,
  showOne,
  remove,
  update,
  sortAuthor,
  filterBooks,
};
