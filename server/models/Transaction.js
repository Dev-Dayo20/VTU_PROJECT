const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["data", "airtime"],
      required: true,
    },
    amount: { type: Number, required: true },
    details: {
      network: {
        type: String,
        required: true,
        enum: ["MTN", "AIRTEL", "GLO", "9mobile"],
      },
      phoneNumber: String,
      planName: String,
      planType: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now, expires: 432000 },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
