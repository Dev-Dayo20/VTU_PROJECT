const Transaction = require("../models/Transaction");

const fetchAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    const totalTransactions = transactions.length;
    if (!transactions || !totalTransactions) {
      return res.status(404).json({ error: "Total transaction not found" });
    }

    const transactionStatus = await Transaction.find({ status: "failed" });
    const totalTransactionStatus = transactionStatus.length;
    if (!transactionStatus) {
      return res.status(404).json({ error: "No failed transaction found" });
    }

    const pendingTransacton = await Transaction.find({ status: "pending" });
    const showPendingTransactions = pendingTransacton.length;
    if (!pendingTransacton || !showPendingTransactions) {
      return res.status(404).json({ error: "No pending transaction" });
    }

    res.status(200).json({
      success: true,
      transactions,
      totalTransactions,
      totalTransactionStatus,
      showPendingTransactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { fetchAllTransactions };
