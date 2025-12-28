

// const User = require("../models/User");

// // REGISTER USER — debug version
// const registerUser = async (req, res) => {
//   try {
//     console.log("📝 Signup request body:", req.body);

//     const { name, email, password, phone, dateOfBirth } = req.body;

//     if (!name || !email || !password || !phone || !dateOfBirth) {
//       return res.status(400).json({
//         message: "All fields are required",
//         received: { name, email, password, phone, dateOfBirth }
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User already exists. Please log in." });
//     }

//     const newUser = new User({ name, email, password, phone, dateOfBirth });

//     const saved = await newUser.save();
//     console.log("✅ New user saved:", saved);

//     res.status(201).json({
//       message: "User registered successfully",
//       user: saved,
//     });
//   } catch (error) {
//     console.error("❗ Register Error — full:", error, error.stack);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found. Please sign up first." });
//     }

//     if (user.password !== password) {
//       return res.status(400).json({ message: "Incorrect password" });
//     }

//     res.status(200).json({ message: "Login successful", user });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = { registerUser, loginUser };

//feqture-2 
const mongoose = require("mongoose");
const User = require("../models/User");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth } = req.body;

    if (!name || !email || !password || !phone || !dateOfBirth) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    const newUser = new User({ name, email, password, phone, dateOfBirth });
    const saved = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: saved,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up first." });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE USER INFO
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, password } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, password },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// FAVORITES
const addFavoriteStation = async (req, res) => {
  try {
    const userId = req.params.id;
    const { station } = req.body;
    if (!station) {
      return res.status(400).json({ message: "Station is required" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteStations: station } },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Added to favorites", user: updated });
  } catch (error) {
    console.error("Add Favorite Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFavoriteStation = async (req, res) => {
  try {
    const userId = req.params.id;
    const { station } = req.body;
    if (!station) {
      return res.status(400).json({ message: "Station is required" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteStations: station } },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Removed from favorites", user: updated });
  } catch (error) {
    console.error("Remove Favorite Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFavoriteStations = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("favoriteStations");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ favoriteStations: user.favoriteStations || [] });
  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// FAVORITE ROUTES
const addFavoriteRoute = async (req, res) => {
  try {
    const userId = req.params.id;
    const { scheduleId, trainName, from, to, departureTime, arrivalTime, price } = req.body;
    
    if (!scheduleId || !trainName || !from || !to) {
      return res.status(400).json({ message: "Required route information missing" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if route already exists
    const exists = user.favoriteRoutes.some(r => r.scheduleId === scheduleId);
    if (exists) {
      return res.status(400).json({ message: "Route already in favorites" });
    }

    const routeData = { scheduleId, trainName, from, to, departureTime, arrivalTime, price };
    
    const updated = await User.findByIdAndUpdate(
      userId,
      { $push: { favoriteRoutes: routeData } },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Added to favorite routes", user: updated });
  } catch (error) {
    console.error("Add Favorite Route Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFavoriteRoute = async (req, res) => {
  try {
    const userId = req.params.id;
    const { scheduleId } = req.body;
    
    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteRoutes: { scheduleId } } },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Removed from favorite routes", user: updated });
  } catch (error) {
    console.error("Remove Favorite Route Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFavoriteRoutes = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("favoriteRoutes");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ favoriteRoutes: user.favoriteRoutes || [] });
  } catch (error) {
    console.error("Get Favorite Routes Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUser,
  addFavoriteStation,
  removeFavoriteStation,
  getFavoriteStations,
  addFavoriteRoute,
  removeFavoriteRoute,
  getFavoriteRoutes,
};
