const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    // console.log("Decoded user", req.admin);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token is not valid or expired" });
  }
};

const adminOnly = async (req, res, next) => {
  if (req.admin.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  next();
};

module.exports = { protect, adminOnly };
