const express = require("express");
const router = express.Router();
const {
  getHistory,
  createHistory,
  updateHistory,
} = require("../controllers/transaction");
const { protect } = require("../middleware/authMiddleware");
const {
  getNetworks,
  getPlanTypesByNetwork,
  getPlansByTypes,
} = require("../controllers/network");

const populate = require("../controllers/populate");

// Get All history
router.get("/history", protect, getHistory);
// Create History
router.post("/create", protect, createHistory);
// Update History
router.put("/update/:id", protect, updateHistory);

// GET NETWORKS< PLANTYPES< PLANS
router.get("/networks", getNetworks);
router.get("/plantypes/:networkId", getPlanTypesByNetwork);
router.get("/plans/:plantype", getPlansByTypes);

router.get("/populatnetwork/:planId", populate);

module.exports = router;
