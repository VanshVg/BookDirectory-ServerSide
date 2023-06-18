const e = require("express");
const bookModel = require("../model/bookModel");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

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

const search = async (req, resp) => {
  const title = req.query.title;
  let data = await bookModel.find({
    title: { $regex: title, $options: "i" },
  });
  resp.status(200).send({ data });
};

const filterBooks = async (req, resp) => {
  const value = req.params.value;
  const books = await bookModel.find({
    genre: { $regex: value, $options: "i" },
  });
  if (books) {
    resp.status(200).send({ books });
  } else {
    resp.status(404).send({ message: "No books found" });
  }
};

const payment = async (req, resp) => {
  if (req.body.quantity) {
    try {
      const { bookData, token, quantity } = req.body;
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      const charge = await stripe.paymentIntents.create({
        amount: bookData.price * 100 * quantity,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${bookData.title}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      });
      resp.status(200).send({
        message: "Payment Successful",
      });
    } catch (error) {
      resp.status(400).send({
        Error: error,
      });
    }
  } else {
    try {
      const { bookData, token } = req.body;
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      const charge = await stripe.paymentIntents.create({
        amount: bookData.price * 100,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${bookData.title}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      });
      resp.status(200).send({
        message: "Payment Successful",
      });
    } catch (error) {
      resp.status(400).send({
        Error: error,
      });
    }
  }
};

module.exports = {
  add,
  show,
  showOne,
  remove,
  update,
  search,
  filterBooks,
  payment,
};
