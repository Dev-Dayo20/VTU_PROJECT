const Wallet = require("../models/wallet_models");
const User = require("../models/user_model");
const Transaction = require("../models/Transaction");

// Fetch user's wallet balance and username
const dashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const transaction = await Transaction.find({ userId });
    if (!transaction)
      return res.status(404).json({ error: "Transaction history not found" });

    res.status(200).json({
      username: user.username,
      wallet: wallet.balance,
      transaction: transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user's data" });
  }
};

module.exports = {
  dashboard,
};
