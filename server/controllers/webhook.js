const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();
const Wallet = require("../models/wallet_models");
const User = require("../models/user_model");

const webhook = async (req, res) => {
  try {
    const paystackSignature = req.headers["x-paystack-signature"];
    if (!paystackSignature) {
      console.error("Paystack signature missing");
      return res.status(400).send("Paystack signature missing");
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== paystackSignature) {
      console.error("Signature mismatch");
      return res.status(401).send("Unauthorized: Invalid signature");
    }

    const event = req.body; // Request that paystack send to our webhook URL
    if (event.event === "charge.success") {
      const paymentData = event.data;
      const userEmail = paymentData.customer.email;
      const amountPaid = paymentData.amount / 100;
      const reference = paymentData.reference;

      const isPaymentVerified = await verifyPayment(reference);
      // console.log("Payment Verified:", isPaymentVerified);

      if (isPaymentVerified) {
        await updateWalletBalance(userEmail, amountPaid);
        // console.log(`Wallet credited for ${userEmail}, amount: ₦${amountPaid}`);
        return res.status(200).send("Wallet credited successfully");
      } else {
        return res.status(400).send("Payment verification failed");
      }
    } else {
      res.status(200).send("Event received but not charge.success");
    }
  } catch (error) {
    console.error("Error handling webhook: ", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Function to verify the payment using Paystack API
const verifyPayment = async (reference) => {
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
    // console.log("Payment Data from Paystack:", paymentData);
    return paymentData.status === "success";
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
};

// Function to update the wallet balance
const updateWalletBalance = async (email, amount) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // console.error(`User with email ${email} not found`);
      throw new Error(`User with email ${email} not found`);
    }

    const wallet = await Wallet.findOne({ userId: user._id });
    // console.log("Wallet Found:", wallet);
    if (!wallet) {
      // console.error(`Wallet not found for user ${email}`);
      throw new Error(`Wallet not found for user ${email}`);
    }

    // Update the wallet balance
    wallet.balance += Number(amount);
    await wallet.save();
  } catch (error) {
    // console.error(`Error updating wallet for ${email}:`, error);
    throw new Error("Wallet update failed");
  }
};

module.exports = { webhook };
