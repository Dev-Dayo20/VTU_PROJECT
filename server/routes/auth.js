// routes/auth.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { purchase_data, getNetworks } = require("../controllers/buy_data.js");
const {
  validatePhoneNumber,
  purchase_airtime,
} = require("../controllers/buy_airtime.js");
const {
  dashboard,
  loginHandler,
  loginValidation,
} = require("../controllers/authControllers.js");
const {
  registerValidation,
  registerHandler,
} = require("../controllers/register.js");
const electricityBills = require("../controllers/electricityBills.js");
const { purchaseData } = require("../controllers/BuyData.js");

const router = express.Router();
//@route POST api/register
//@desc register a new user
router.post("/register", registerValidation, registerHandler);

//@route POST api/auth/login
//@desc log in user and return JWT token
router.post("/login", loginValidation, loginHandler);

//@route POST api/auth/dashboard
//@desc dashboard
router.get("/dashboard", protect, dashboard);

//@route POST & GET
//@desc buy data
router.post("/buy-data", protect, purchaseData);
// router.post("/purchase-data", protect, purchase_data);
// router.get("/networks", getNetworks);

//@route POST
//@desc buy airtime
router.post("/purchase-airtime", protect, purchase_airtime);

//@route POST
//@desc electricity bills
router.post("/bill-payment", electricityBills);
module.exports = router;
