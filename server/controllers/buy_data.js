const axios = require("axios");
const dataPlans = require("../config/dataPlans.json");
require("dotenv").config();
const Wallet = require("../models/wallet_models");
const Transaction = require("../models/Transaction");

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

const networkMap = {
  1: "MTN",
  4: "AIRTEL",
  2: "GLO",
  3: "9mobile",
};

const purchase_data = async (req, res) => {
  const { phoneNumber, networkId, plans: planId, portedNumber } = req.body;

  // Validation Checkings
  const errors = [];
  if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
    return res.status(400).json({ error: "Invalid Phone Number" });
  }
  if (!networkId || !dataPlans.networks[networkId]) {
    return res.status(400).json({ error: "Invalid Network" });
  }

  // Get the network data
  const network = dataPlans.networks[networkId];
  if (!network) {
    return res.status(400).json({ error: "Network not found" });
  }

  // Get the network name (MTN, Airtel, etc.)
  const networkName = Object.keys(network)[0];

  // Find the plan in the nested structure
  let selectedPlan = null;
  const planTypes = network[networkName].planType;

  // Search through all plan types (SME, CORPERATE GIFTING, etc.)
  for (const type of Object.values(planTypes)) {
    if (type.plans && type.plans[planId]) {
      selectedPlan = type.plans[planId];
      break;
    }
  }

  if (!selectedPlan) {
    return res.status(400).json({ error: "Plan not found" });
  }

  // Convert price string to number (remove currency symbol and parse)
  const planPrice = Number(selectedPlan.price.replace(/[₦N]/g, ""));

  if (isNaN(planPrice)) {
    return res.status(400).json({ error: "Invalid Plan" });
  }

  const userId = req.user.id;
  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    return res.status(400).json({ error: "Wallet not found" });
  }

  // Check if user has sufficient balance
  if (wallet.balance < planPrice) {
    return res.status(400).json({ error: "Insufficient wallet balance" });
  }

  console.log(`Wallet before deduction: ${wallet.balance}`);

  // Calculate new balance
  const originalBalance = wallet.balance;
  wallet.balance -= planPrice;
  await wallet.save();
  console.log(`Wallet after deduction: ${wallet.balance}`);

  // Create transaction history inthe database
  const transaction = new Transaction({
    userId,
    type: "data",
    amount: planPrice,
    details: {
      network: networkMap[networkId],
      phoneNumber,
      planType: planId,
    },
    status: "pending",
  });
  await transaction.save();

  // API Call functions
  try {
    const response = await axios.post(
      "https://www.ufardata.com/api/data/",
      {
        network: networkId,
        mobile_number: phoneNumber,
        plan: planId,
        Ported_number: portedNumber === true,
      },
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

module.exports = {
  purchase_data,
  getNetworks,
};
