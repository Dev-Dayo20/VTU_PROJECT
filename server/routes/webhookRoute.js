const express = require("express");
const router = express.Router();
const { webhook } = require("../controllers/webhook");

router.post("/paystack/webhook", webhook);
module.exports = router;
