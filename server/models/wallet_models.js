const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0.0,
    },
    currency: {
      type: String,
      default: "NGN",
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("wallet", walletSchema);
module.exports = Wallet;
