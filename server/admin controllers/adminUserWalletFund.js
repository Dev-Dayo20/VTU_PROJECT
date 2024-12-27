const axios = require("axios");
const User = require("../models/user_model");

const adminUserFund = async (req, res) => {
  const { amount, email } = req.body;
  const username = req?.admin?.username;

  if (!email || !amount) {
    return res.status(401).json({ error: "All fields are required" });
  }

  // Validate the amount
  if (isNaN(amount) || amount < 100) {
    return res.status(400).json({ error: "Invalid amount provided" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ error: `User with ${email} not found` });
  }

  const formattedAmount = Math.round(amount * 100);
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: formattedAmount,
        email: email,
        callback_url:
          "https://9b75-102-91-103-94.ngrok-free.app/payment-callback",
        metadata: { username: username },
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const { reference, authorization_url, access_code } = response.data.data;
    res.status(200).json({
      success: true,
      authorization_url: authorization_url,
      reference: reference,
      accessCode: access_code,
    });
  } catch (error) {
    // Log detailed error information
    console.error("Error Details:", error.response?.data || error.message);

    // Send a user-friendly error message
    res.status(500).json({
      error: error.response?.data?.message || "Something went wrong",
    });
  }
};

module.exports = { adminUserFund };
