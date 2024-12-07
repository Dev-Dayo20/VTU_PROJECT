const User = require("../models/user_model");
const Transaction = require("../models/Transaction");

const recent = async (req, res) => {
  try {
    const recentSignups = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt username status");

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "userId",
        select: "username email ",
      })
      .select("type amount details status userId createdAt");

    // Check if either array is empty
    if (recentSignups.length === 0 || recentTransactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recent data found",
        recentSignups,
        recentTransactions,
      });
    }

    res.status(200).json({
      success: true,
      recentSignups,
      recentTransactions,
      recentTransactionsAll: recentTransactions.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error. Try again later" });
  }
};

module.exports = recent;
