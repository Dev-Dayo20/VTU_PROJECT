const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const { check, validationResult } = require("express-validator");
const Wallet = require("../models/wallet_models");

const registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("username", "Userame is required").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("phoneNumber", "Phone Number is required").not().isEmpty(),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];

const registerHandler = async (req, res) => {
  const { name, username, email, phoneNumber, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Checking if already exists with email & username
    let user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (user) {
      if (user.email === email) {
        return res.status(400).json({
          errors: [
            { msg: "User with this email already exists", param: "email" },
          ],
        });
      } else if (user.username === username) {
        return res.status(400).json({
          errors: [{ msg: "Username already taken", param: "username" }],
        });
      }
    }
    // @create new user
    user = new User({
      name,
      username,
      email,
      phoneNumber,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    //create user wallet
    const wallet = new Wallet({
      userId: user._id,
      balance: 0.0,
      currency: "NGN",
    });
    await wallet.save();

    //@Create a payload
    const payload = {
      user: { id: user.id, username: user.username, email: user.email },
    };
    //@JWT sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (error, token) => {
        if (error) throw error;

        res.status(200).json({
          msg: "user created successfully",
          token: token,
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

module.exports = {
  registerValidation,
  registerHandler,
};
