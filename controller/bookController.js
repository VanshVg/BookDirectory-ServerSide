const bookModel = require("../model/bookModel");
const { v4: uuidv4 } = require("uuid");

const add = async (req, resp) => {
  let imageUrl = "";
  let newBookId = uuidv4();

  if (req.file) {
    imageUrl = `http://localhost:4000/${req.file.filename}`;
  }
  let data = new bookModel({
    bookId: newBookId,
    title: req.body.title,
    isbn: req.body.isbn,
    pages: req.body.pages,
    author: req.body.author,
    price: req.body.price,
    imageUrl: imageUrl,
    description: req.body.description,
    genre: Object.values(req.body.genre),
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
  const { bookId } = req.params;
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

const update = async (req, resp) => {
  const { bookId } = req.params;
  let book = await bookModel.findOne({ bookId: bookId });
  if (!book) {
    resp.status(404).send({
      message: "Book doesn't exist",
    });
  } else {
    await bookModel.updateOne({ bookId: bookId }, { $set: req.body });
    resp.status(200).send({
      message: "Book updated",
    });
    console.log("Book updated");
  }
};

const sortAuthor = async (req, resp) => {
  let data = await bookModel.find({ author: req.body.author });
  resp.status(200).send({ data });
  console.log({ data });
};

module.exports = { add, show, showOne, remove, update, sortAuthor };
