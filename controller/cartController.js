const cartModel = require("../model/cartModel");
const bookModel = require("../model/bookModel");

const add = async (req, resp) => {
  const bookId = req.params.id;
  const userId = req.body.userId;
  let cartBook = await cartModel.findOne({ bookId: bookId, userId: userId });
  if (cartBook) {
    currentQuantity = cartBook.quantity;
    newQuantity = currentQuantity + 1;

    await cartModel.updateOne(
      { bookId: bookId, userId: userId },
      { $set: { quantity: newQuantity } }
    );
    resp.status(200).send({
      message: "Quanity updated",
    });
  } else {
    let bookData = await bookModel.findOne({ bookId: bookId });
    let data = new cartModel({
      userId: userId,
      bookId: bookData.bookId,
      title: bookData.title,
      isbn: bookData.isbn,
      author: bookData.author,
      price: bookData.price,
      imageUrl: bookData.imageUrl,
      description: bookData.description,
      genre: bookData.genre,
      quantity: 1,
    });
    let result = await data.save();
    resp.status(200).send({ result });
  }
};

const show = async (req, resp) => {
  const userId = req.query.userId;
  let data = await cartModel.find({ userId: userId });
  resp.status(200).send({ data });
};

const remove = async (req, resp) => {
  const bookId = req.params.id;
  const userId = req.query.userId;
  console.log(userId);
  let deleteBook = await cartModel.find({ bookId: bookId, userId: userId });
  deleteBook = 1;
  if (deleteBook.length == 0) {
    resp.status(404).send({
      message: "This book doesn't exist",
    });
  } else {
    await cartModel.deleteOne({ bookId: bookId, userId: userId });
    resp.status(200).send({
      message: "Book successfully removed",
    });
  }
};

const addQuantity = async (req, resp) => {
  const bookId = req.params.id;

  const cartBook = await cartModel.findOne({ bookId: bookId });
  currentQuantity = cartBook.quantity;
  newQuantity = currentQuantity + 1;

  await cartModel.updateOne(
    { bookId: bookId },
    { $set: { quantity: newQuantity } }
  );
  resp.status(200).send({
    message: "Quantity updated successfully",
  });
};

const removeQuantity = async (req, resp) => {
  const bookId = req.params.id;

  const cartBook = await cartModel.findOne({ bookId: bookId });

  currentQuantity = cartBook.quantity;
  newQuantity = currentQuantity - 1;

  await cartModel.updateOne(
    { bookId: bookId },
    { $set: { quantity: newQuantity } }
  );
  resp.status(200).send({
    message: "Quantity updated successfully",
  });
};

module.exports = { add, show, remove, addQuantity, removeQuantity };
