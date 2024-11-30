const axios = require("axios");
require("dotenv").config();
const Wallet = require("../models/wallet_models");
const Transaction = require("../models/Transaction");

// Regex format to validate Nigerian phone numbers
const validatePhoneNumber = (mobileNumber) => {
  const regex = /^0\d{10}$/;
  return regex.test(mobileNumber);
};

const networkMap = {
  1: "MTN",
  4: "AIRTEL",
  2: "GLO",
  3: "9mobile",
};

const purchase_airtime = async (req, res) => {
  const { networkId, amount, mobileNumber, portedNumber, airtimeType } =
    req.body;

  // Validate required fields
  if (!networkId || !amount || !mobileNumber || !airtimeType) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // Validate phone number
  if (!validatePhoneNumber(mobileNumber)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  const userId = req.user.id;
  const wallet = await Wallet.findOne({ userId });

  if (!wallet) return res.status(400).json({ error: "Wallet not found" });
  if (wallet.balance < amount)
    return res.status(400).json({ error: "Insufficient wallet balance" });
  if (amount < 50)
    return res.status(400).json({ error: "Amount has to be greater than 50" });

  const originalBalance = wallet.balance;
  wallet.balance -= amount;
  await wallet.save();
  // console.log(`Wallet before deduction: ${originalBalance}`);

  // Create transaction history in the database with a "pending" status
  const transaction = new Transaction({
    userId,
    type: "airtime",
    amount: amount,
    details: {
      network: networkMap[networkId],
      phoneNumber: mobileNumber,
      planName: airtimeType,
    },
    status: "pending",
  });
  await transaction.save();

  try {
    // Prepare data for the external API
    const data = {
      network: networkId,
      amount,
      mobile_number: mobileNumber,
      Ported_number: portedNumber === true,
      airtime_type: airtimeType,
    };

    // Call external API and log full response for debugging
    const response = await axios.post(
      "https://www.ufardata.com/api/topup/",
      data,
      {
        headers: {
          Authorization: `Token ${process.env.UFARDATA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(
    //   "Received response from Ufardata:",
    //   JSON.stringify(response.data)
    // );

    // Check if the API response was successful and perform this operations
    if (response.data.success || response.data.Status === "successful") {
      transaction.status = "completed";
      await transaction.save();

      return res.status(200).json({
        success: true,
        message: "Airtime purchase successful",
        data: response.data,
        transaction: transaction,
      });
    } else {
      throw new Error("Airtime purchase failed");
    }
  } catch (error) {
    console.error(
      "Error in airtime purchase:",
      error.response?.data || error.message
    );

    // Rollback balance and update transaction status to "failed"
    wallet.balance = originalBalance;
    await wallet.save();
    // console.log(`Rollback balance: ${wallet.balance}`);

    transaction.status = "failed";
    await transaction.save();

    // Log specific error details for further debugging
    if (error.response && error.response.status >= 500) {
      return res
        .status(500)
        .json({ error: "Ufardata API error. Please try again later." });
    }

    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage =
        error.response.data.error[0] || "Unknown error occurred";
      return res.status(400).json({ error: errorMessage });
    }

    // Default error response
    return res.status(400).json({
      error: "Airtime purchase failed. Check your details and try again.",
      details: error.response ? error.response.data : error.message,
    });
  }
};

module.exports = { validatePhoneNumber, purchase_airtime };
