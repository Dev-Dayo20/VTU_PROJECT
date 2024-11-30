const User = require("../models/user_model");

const fetchUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const searchFilter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ],
    };

    const activeUsers = await User.find({ status: "Active" });
    if (!activeUsers) {
      return res.status(400).json({ error: "No active user found" });
    }
    const totalActiveUsers = activeUsers.length;

    const blockedUsers = await User.find({ status: "Blocked" });
    if (!blockedUsers) {
      return res.status(404).json({ error: "No blocked users found" });
    }
    const totalBlockedUsers = blockedUsers.length;
    // if (totalBlockedUsers < 0 || totalBlockedUsers === null) {
    //   return res.status(404).json({ error: "No Blocked Users" });
    // }

    // Fetch filtered users with pagination
    const users = await User.find(searchFilter)
      .skip((page - 1) * limit) // Skip users from previous pages
      .limit(parseInt(limit)); // Limit results per page

    // Get total number of users matching the search
    const totalUsers = await User.countDocuments(searchFilter);

    res.status(200).json({
      success: true,
      users,
      status: users.status,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      totalUsers,
      totalActiveUsers,
      totalBlockedUsers,
      blockedUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "An error occured while fetching users" });
  }
};

module.exports = { fetchUsers };
