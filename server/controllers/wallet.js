const Wallet = require("../models/wallet_models");
const User = require("../models/user_model");

// Fetch user's wallet balance and username
const dashboard = async (req, res) => {
  try {
    const { userId } = req.user;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      username: user.username,
      wallet: wallet.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching wallet and user data" });
  }
};

module.exports = {
  dashboard,
};
