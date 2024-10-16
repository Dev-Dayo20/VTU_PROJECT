const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const { check, validationResult } = require("express-validator");
const Wallet = require("../models/wallet_models");

//@route POST api/auth/login
//@desc log in user and return JWT token
const loginValidation = [
  check("email", "Email is required").notEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Provide your password").notEmpty(),
];
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  // Validate input fields
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // check if email exist by email
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid credentials", param: "email" }] });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errors: [{ msg: "Invalid credentials", param: "password" }],
      });
    }

    //create a payload
    const payload = {
      user: { id: user.id, username: user.username, email: user.email },
    };

    // Sign JWT and return token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ user: user.username, token });
        console.log(err);
      }
    );
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: ["server error"] });
  }
};

// @Desc dashboard route
// @POST request
const dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const wallet = await Wallet.findOne({ userId: user.id });

    res.status(200).json({
      username: user.username,
      wallet: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  dashboard,
  loginValidation,
  loginHandler,
};
