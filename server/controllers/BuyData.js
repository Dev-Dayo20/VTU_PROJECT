const { Network, Plan } = require("../models/Network");
const axios = require("axios");
require("dotenv").config();
const Wallet = require("../models/wallet_models");
const Transaction = require("../models/Transaction");

const purchaseData = async (req, res) => {
  const { networkId, planId, mobileNumber, portedNumber } = req.body;
  if (!networkId || !planId || !mobileNumber || !portedNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const network = await Network.findOne({
    networkId,
    status: "active",
  });
  if (!network) {
    return res
      .status(404)
      .json({ error: `Network ${networkId} not found or inactive` });
  }

  const plan = await Plan.findOne({
    planId,
    status: "active",
  }).populate("planTypeId");
  if (!plan) {
    return res.status(404).json({ error: "Plan not found or inactive" });
  }

  const userId = req.user.id;

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  } else if (wallet.balance < plan.price) {
    return res
      .status(400)
      .json({ error: "Insufficient wallet balance to make purchase" });
  }

  const originalBalance = wallet.balance;
  wallet.balance -= plan.price;
  await wallet.save();

  const transaction = new Transaction({
    userId,
    type: "data",
    amount: plan.price,
    details: {
      network: network.name,
      phoneNumber: mobileNumber,
      planType: plan.name,
    },
    status: "pending",
  });
  await transaction.save();

  const data = {
    network: networkId,
    mobile_number: mobileNumber,
    plan: planId,
    Ported_number: portedNumber === true,
  };

  try {
    const response = await axios.post(
      "https://www.ufardata.com/api/data/",
      data,
      {
        headers: {
          Authorization: `Token ${process.env.UFARDATA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success || response.data.Status === "successful") {
      transaction.status = "completed";
      await transaction.save();

      return res.status(200).json({
        success: true,
        message: "Data purchase successful!",
        data: response.data,
      });
    }
    console.log(response.data);
  } catch (error) {
    console.log(
      "Error making API call:",
      error.response ? error.response.data : error.message
    );

    // Revert the balance in case of API failure
    wallet.balance = originalBalance;
    await wallet.save();
    console.log(`Rollback balance: ${wallet.balance}`);

    transaction.status = "failed";
    await transaction.save();

    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.error || "Something went wrong";
      res.status(400).json({ error: errorMessage });
    }
    return res.status(500).json({
      error: "Failed to purchase data. Please try again.",
      details: error.response?.data || error.message,
    });
  }
};

module.exports = { purchaseData };
