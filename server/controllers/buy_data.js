const axios = require("axios");
const dataPlans = require("../config/dataPlans.json");
require("dotenv").config();
const Wallet = require("../models/wallet_models");

const validatePhoneNumber = (phoneNumber) => {
  const regex = /^0\d{10}$/;
  return regex.test(phoneNumber);
};

// function to fetch available networks
const getNetworks = async (req, res) => {
  res.json({
    success: true,
    networks: dataPlans.networks,
  });
};

const purchase_data = async (req, res) => {
  const { phoneNumber, networkId, plans, portedNumber } = req.body;
  // Validation Checkings
  const errors = [];
  if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
    errors.push({ param: "phoneNumber", msg: "Invalid phone number." });
  }
  if (!networkId || !dataPlans.networks[networkId]) {
    errors.push({ param: "networkId", msg: "Invalid network selected." });
  }
  if (!plans) {
    errors.push({ param: "planId", msg: "Invalid plan selected." });
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { userId } = req.user;

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    res.status(400).json({ message: "Wallet not found" });
    return;
  }

  wallet.balance -= plans.price;
  await wallet.save();

  // API Call functions
  try {
    const response = await axios.post(
      "https://www.ufardata.com/api/data/",
      {
        network: networkId,
        mobile_number: phoneNumber,
        plan: plans,
        Ported_number: portedNumber,
      },
      {
        headers: {
          Authorization: `Token ${process.env.UFARDATA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Data purchase successful!",
      data: response.data,
    });
  } catch (error) {
    console.log(
      "Error making API call:",
      error.response ? error.response.data : error.message
    );
    wallet.balance += plans.price;
    await wallet.save();

    return res.status(500).json({
      error: "Failed to purchase data. Please try again.",
      error: error.response.data,
    });
  }
};

module.exports = {
  purchase_data,
  getNetworks,
};
