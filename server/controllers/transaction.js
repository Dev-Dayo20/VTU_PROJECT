const Transaction = require("../models/Transaction");
const axios = require("axios");
const Users = require("../models/user_model");

// Get user's transaction history
const getHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const totalTransactions = await Transaction.find({});
    const overAllTransactions = totalTransactions.length;

    const transactions = await Transaction.find({ userId })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    if (!transactions) {
      return res
        .status(400)
        .json({ error: "No user transaction history found" });
    }
    res.status(200).json({ message: true, transactions, overAllTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error fetching transaction history" });
  }
};

const createHistory = async (req, res) => {
  const { type, amount, details } = req.body;
  try {
    const transaction = new Transaction({
      userId: req.user.id,
      type,
      amount,
      details,
      status: "pending",
    });
    await transaction.save();
    res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating transaction" });
  }
};

const updateHistory = async (req, res) => {
  const { status } = req.body;
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.param.id, userId: req.user.id },
      { status },
      { new: true }
    );
    res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating transaction" });
  }
};
module.exports = { getHistory, createHistory, updateHistory };
