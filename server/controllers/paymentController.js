const axios = require("axios");
const Wallet = require("../models/wallet_models");
const User = require("../models/user_model");
require("dotenv").config();

// @desc POST request
// @desc initiating payment with paystack
const initiatePayment = async (req, res) => {
  const { amount } = req.body;
  const username = req.user?.username;
  const email = req.user?.email;

  if (!username || !email) {
    return res.status(401).json({
      errors: [{ msg: "User not authenticated", param: "protect" }],
    });
  }
  const errors = [];

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ errors: [{ msg: "User not found", param: "username" }] });
    }
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: email,
        amount: amount * 100,
        callback_url:
          "https://43b9-102-91-102-50.ngrok-free.app/payment-callback",
        metadata: {
          username: username,
        },
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const { reference, authorization_url } = response.data.data;
    res.status(200).json({
      status: "success",
      authorization_url: response.data.data.authorization_url,
      reference: reference,
    });
  } catch (error) {
    console.error(error);

    // Handle Paystack or server-side errors
    res.status(500).json({
      message: "Error initiating payment",
      error: error.response?.data?.message || error.message,
    });
  }
};

//@ desc GET request
//@ desc verifying payment control function
const verifyPayment = async (req, res) => {
  const { reference } = req.query;
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data.data;
    if (paymentData.status === "success") {
      const email = paymentData.customer.email;
      const amountPaid = paymentData.amount;
      const paidAt = paymentData.paid_at;
      const reference = paymentData.reference;

      return res.json({
        status: "success",
        message: "Payment Verified",
        user: email,
        amount: amountPaid,
        date: paidAt,
      });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
};

// @Transaction Details/:reference
// @method GET

const getTransctionDetails = async (req, res) => {
  const { reference } = req.params;
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const paymentData = response.data.data;
    if (paymentData.status === "success" || paymentData.status === "failed") {
      const Status = paymentData.status;
      const Email = paymentData.customer.email;
      const amountPaid = paymentData.amount / 100;
      const reference = paymentData.reference;
      const date = paymentData.paid_at;

      res.status(200).json({
        payment_status: Status,
        user: Email,
        amountPaid: amountPaid,
        payment_reference: reference,
        paymentDate: date,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Transaction not found or still processing" });
    }
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { initiatePayment, verifyPayment, getTransctionDetails };
