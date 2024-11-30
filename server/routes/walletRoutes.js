const express = require("express");
const router = express.Router();
const { dashboard } = require("../controllers/wallet");
const { protect } = require("../middleware/authMiddleware");

router.get("/wallet-dashboard", protect, dashboard);

module.exports = router;
