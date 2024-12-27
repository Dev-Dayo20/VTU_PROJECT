const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin model/adminReg");

const adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let IsAdminExist = await Admin.findOne({ email });
    if (IsAdminExist)
      return res
        .status(400)
        .json({ error: "Admin with this email already exists" });

    const admin = new Admin({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Administrator registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invlid email or password" });
    }

    let isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    //Generate a JWT token for Routes access
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
        username: "admin",
        email: "adminairatech@gmail.com",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { adminRegister, adminLogin };
