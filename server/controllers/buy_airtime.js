const axios = require("axios");
require("dotenv").config();
const Wallet = require("../models/wallet_models");

// Regex format to validate nigerian number inputs
const validatePhoneNumber = (mobileNumber) => {
  const regex = /^0\d{10}$/;
  return regex.test(mobileNumber);
};

const purchase_airtime = async (req, res) => {
  const { networkId, amount, mobileNumber, portedNumber, airtimeType } =
    req.body;

  const userId = req.user.id;
  console.log("User ID for wallet lookup", userId);

  // Validate required fields
  if (!networkId || !amount || !mobileNumber || !airtimeType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate phone number
  if (!validatePhoneNumber(mobileNumber)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  try {
    // Find user's wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(400).json({ message: "Wallet not found" });
    }

    console.log("Wallet balance before deduction:", wallet.balance);
    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    // Deduct balance
    const originalBalance = wallet.balance;
    wallet.balance -= amount;
    await wallet.save();
    console.log("Wallet balance after deduction:", wallet.balance);

    // Prepare data for external API
    const data = {
      network: networkId,
      amount: amount, // Make sure amount is correctly passed
      mobile_number: mobileNumber,
      Ported_number: portedNumber === true,
      airtime_type: airtimeType,
    };

    console.log("Amount being sent to the external API:", amount); // Debugging log for amount

    const config = {
      method: "post",
      url: "https://www.ufardata.com/api/topup/",
      headers: {
        Authorization: `Token ${process.env.UFARDATA_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    // Call external API
    const response = await axios(config);
    console.log(
      "Received response from Ufardata:",
      JSON.stringify(response.data)
    );

    if (response.data.success) {
      return res
        .status(200)
        .json({ message: "Airtime purchase successful", data: response.data });
    } else {
      // Restore balance if API call fails
      wallet.balance = originalBalance;
      await wallet.save();
      return res
        .status(400)
        .json({ error: "Airtime purchase failed", details: response.data });
    }
  } catch (error) {
    // Handle errors gracefully
    console.error(
      "Error purchasing airtime:",
      error.response ? error.response.data : error.message
    );

    // Rollback balance in case of error
    const wallet = await Wallet.findOne({ userId });
    if (wallet) {
      wallet.balance += Number(amount);
      await wallet.save();
    }

    // Handle Ufardata API errors
    if (error.response && error.response.status >= 500) {
      return res
        .status(500)
        .json({ error: "Ufardata API error. Please try again later." });
    }

    // Handle specific error for insufficient balance
    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage =
        error.response.data.error[0] || "Unknown error occurred";
      return res.status(400).json({ error: errorMessage });
    }

    return res.status(400).json({
      error: "Airtime purchase failed. Check your details and try again.",
      details: error.response ? error.response.data : error.message,
    });
  }
};

module.exports = { validatePhoneNumber, purchase_airtime };
