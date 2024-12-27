const User = require("../models/user_model");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/wallet_models");

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const userById = await User.findById(id).select(
      "name username email phoneNumber createdAt status"
    );

    if (!userById) {
      return res.status(404).json({ error: "User not found" });
    }

    const transaction = await Transaction.find({ userId: id }).select(
      "details type amount status createdAt"
    );
    const wallet = await Wallet.findOne({ userId: id });
    const userWithTransaction = {
      ...userById.toObject(),
      transaction,
    };

    res.status(200).json({
      success: true,
      data: {
        user: userWithTransaction,
        totalTransactions: transaction.length,
        wallet: wallet,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  const allowedStatus = ["Active", "Suspended", "Blocked"];

  if (!status || !allowedStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status. Must be one of: Active, Suspended, Blocked",
    });
  }

  try {
    const currentUserStatus = await User.findOne({ _id: id });
    if (status === currentUserStatus.status) {
      return res
        .status(400)
        .json({ success: false, error: `User is already ${status}` });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { status, statusReason: reason || null },
      {
        new: true,
      }
    );

    if (updatedUser && updatedUser.status === "Active") {
      updatedUser.statusReason = null;
      await updatedUser.save();
    }

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getUserById, updateUserStatus };
