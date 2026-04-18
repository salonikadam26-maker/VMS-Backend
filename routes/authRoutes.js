const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure models/User.js exists

// @route   POST /api/auth/login
// @desc    Login user & get token
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // 1. Check if user exists in MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User record not found. Please check your email." });
    }

    // 2. Compare the entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid password. Please try again." });
    }

    // 3. Verify if the selected role matches the user's role in DB
    if (user.role !== role) {
      return res
        .status(403)
        .json({ msg: `Access denied. You are not registered as ${role}.` });
    }

    // 4. Create Payload for JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // 5. Sign the Token (Expires in 24 hours)
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Make sure this is in your .env file
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            name: user.name, // If you have a name field
            email: user.email,
            role: user.role,
          },
        });
      },
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("Server Error occurred during login.");
  }
});

module.exports = router;
