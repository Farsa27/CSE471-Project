
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
  addFavoriteStation,
  removeFavoriteStation,
  getFavoriteStations,
} = require("../controllers/userController");
const User = require("../models/User");
const mongoose = require("mongoose");

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

// Update only the date of birth for Google users
router.put("/update-dob/:id", async (req, res) => {
  const userId = req.params.id;
  const { dateOfBirth } = req.body;

  if (!dateOfBirth) {
    return res.status(400).json({ message: "Date of birth is required." });
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    // Ensure we store a string and run schema validators
    const dobString = typeof dateOfBirth === "string" ? dateOfBirth.trim() : String(dateOfBirth);

    const user = await User.findByIdAndUpdate(
      userId,
      { dateOfBirth: dobString },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("DOB update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile by ID
router.get("/:id", getUserById);

// Get all users (Admin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile by ID
router.put("/:id", updateUser);

// Favorites
router.get("/:id/favorites", getFavoriteStations);
router.post("/:id/favorites", addFavoriteStation);
router.delete("/:id/favorites", removeFavoriteStation);

module.exports = router;
