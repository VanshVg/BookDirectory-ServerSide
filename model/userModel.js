const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  role: String,
  password: String,
  userId: String,
});

module.exports = mongoose.model("userdatas", userSchema);
