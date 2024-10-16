const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  initiatePayment,
  verifyPayment,
  getTransctionDetails,
} = require("../controllers/paymentController");

router.post("/paystack/initiate", protect, initiatePayment);
router.get("/paystack/verify", verifyPayment);
router.get("/transaction-details/:reference", getTransctionDetails);

module.exports = router;
