
// const express = require("express");
// const router = express.Router();
// const { registerUser, loginUser } = require("../controllers/userController");
// const User = require("../models/User");

// // Register (normal + google)
// router.post("/register", registerUser);

// // Login (normal + google)
// router.post("/login", loginUser);

// // Google login check
// router.post("/google-login", async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user) {
//       return res.status(200).json({ message: "User exists" });
//     } else {
//       return res.status(404).json({
//         message: "User not found. Please sign up first with Google.",
//       });
//     }
//   } catch (error) {
//     console.error("Error in Google login:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

//feature-2

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const User = require("../models/User");

// Register (normal + Google)
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Google login check
router.post("/google-login", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ message: "User exists", user });
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

// Get user profile by ID
router.get("/:id", getUserById);

// Update user profile by ID
router.put("/:id", updateUser);

module.exports = router;
