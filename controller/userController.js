const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const register = async (req, resp) => {
  try {
    let userEmail = await userModel.findOne({ email: req.body.email });
    if (userEmail) {
      resp.status(400).send({
        message: "User already exists",
      });
    } else {
      bcrypt.hash(req.body.password, 10, async function (err, hash) {
        let newUserId = uuidv4();
        let data = new userModel({
          userId: newUserId,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          role: req.body.role,
          password: hash,
        });
        let results = await data.save();
        try {
          jwt.sign(
            { data: results },
            process.env.ACCESS_TOKEN_SECRET,
            (err, token) => {
              if (err) {
                throw err;
              } else {
                resp
                  .status(200)
                  .cookie("token", token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000,
                  })
                  .send({
                    isLoggedIn: true,
                    role: req.body.role,
                    userToken: token,
                  });
              }
            }
          );
        } catch (err) {
          console.log("Error signing JWT:", err);
          resp.status(500).sned({
            message: "Internal Server Error",
          });
        }
      });
    }
  } catch (err) {
    console.log("Error registering user:", err);
    resp.status(400).send({
      message: "Field is Missing",
    });
  }
};

const login = async (req, resp) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      bcrypt.compare(
        req.body.password,
        user.password,
        async function (err, result) {
          if (result === true) {
            try {
              jwt.sign(
                { data: user },
                process.env.ACCESS_TOKEN_SECRET,
                (err, token) => {
                  if (err) {
                    throw err;
                  } else {
                    resp.status(200).send({
                      isLoggedIn: true,
                      role: user.role,
                      userToken: token,
                    });
                  }
                }
              );
            } catch (err) {
              console.log("Error signing JWT:", err);
              resp.status(500).send({
                Error: "Internal Error",
              });
            }
          } else {
            resp.status(401).send({
              message: "Password not matched",
            });
          }
        }
      );
    } else {
      resp.status(404).send({
        message: "User Not Found",
      });
    }
  } catch (err) {
    resp.status(400).send({
      Error: "Error",
    });
  }
};

const logout = async (req, resp) => {
  resp.status(200).send({ isLoggedIn: false });
};

const show = async (req, resp) => {
  let data = await userModel.find();
  resp.status(200).send({ data });
};

const profile = async (req, resp) => {
  let userId = req.query.userId;
  let data = await userModel.findOne({ userId: userId });
  resp.status(200).send({ data });
};

const checkPassword = async (req, resp) => {
  let userId = req.query.userId;
  let user = await userModel.findOne({ userId: userId });
  try {
    bcrypt.compare(
      req.query.password,
      user.password,
      async function (err, result) {
        if (result === true) {
          resp.status(200).send({
            message: "Password is correct",
          });
        } else {
          resp.status(401).send({
            message: "Password is invalid",
          });
        }
      }
    );
  } catch (err) {
    resp.status(500).send({
      Error: "Internal Server Error",
    });
  }
};

const newPassword = async (req, resp) => {
  let userId = req.query.userId;
  bcrypt.hash(req.body.newpassword, 10, async function (err, hash) {
    await userModel.updateOne({ userId: userId }, { $set: { password: hash } });
    resp.status(200).send({
      message: "Password updated Successfully",
    });
  });
};

module.exports = {
  register,
  login,
  logout,
  show,
  profile,
  checkPassword,
  newPassword,
};
