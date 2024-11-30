const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/adminMiddleware");
const { fetchUsers } = require("../admin controllers/getUsers");
const { adminRegister, adminLogin } = require("../admin controllers/adminAuth");
const {
  fetchAllTransactions,
} = require("../admin controllers/getTransactions");

// Admin Authentication
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

// Fetch Users from Database (Admin Only)
router.get("/admin/users", protect, adminOnly, fetchUsers);
router.get("/admin/users/:id"); //Fetch user's specific details
router.put("/admin/users/:id"); //Update user's specific details
router.delete("/admin/users/:id"); // Delete user
router.patch("/admin/users/:id/status"); // Suspend/Activate user account
router.get("/admin/users/:id/transaction"); // Fetch user's specific transactions

router.get("/admin/transactions", protect, adminOnly, fetchAllTransactions);

module.exports = router;
