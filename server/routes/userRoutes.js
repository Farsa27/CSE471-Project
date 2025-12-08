
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const User = require("../models/User");

// Register (normal + google)
router.post("/register", registerUser);

// Login (normal + google)
router.post("/login", loginUser);

// Google login check
router.post("/google-login", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ message: "User exists" });
    } else {
      return res.status(404).json({
        message: "User not found. Please sign up first with Google.",
      });
    }
  } catch (error) {
    console.error("Error in Google login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

