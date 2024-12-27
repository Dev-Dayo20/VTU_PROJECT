const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/adminMiddleware");
const { fetchUsers } = require("../admin controllers/getUsers");
const { adminRegister, adminLogin } = require("../admin controllers/adminAuth");
const {
  fetchAllTransactions,
} = require("../admin controllers/getTransactions");
const recent = require("../admin controllers/RecentActivities");
const {
  getUserById,
  updateUserStatus,
} = require("../admin controllers/userInfo");
const { adminUserFund } = require("../admin controllers/adminUserWalletFund");

// Admin Authentication
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

// Fetch Users from Database (Admin Only)
router.get("/admin/users", protect, adminOnly, fetchUsers);
router.get("/admin/users/:id", getUserById); //Fetch user's specific details
router.put("/admin/users/:id", updateUserStatus); //Update user's specific details
router.delete("/admin/users/:id"); // Delete user
router.patch("/admin/users/:id/status"); // Suspend/Activate user account
router.get("/admin/users/:id/transaction"); // Fetch user's specific transactions

router.get("/admin/transactions", protect, adminOnly, fetchAllTransactions);
//Recent Activities Route
router.get("/admin/recent-activities", protect, recent);

//Admin User Wallet Funding Route
router.post("/admin/fundwallet", protect, adminOnly, adminUserFund);

module.exports = router;
