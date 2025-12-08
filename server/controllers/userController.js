
// const User = require("../models/User");

// // ---------------------- REGISTER USER ----------------------
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phone, dateOfBirth } = req.body;

//     if (!name || !email || !password || !phone || !dateOfBirth) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User already exists. Please log in." });
//     }

//     const newUser = new User({
//       name,
//       email,
//       password,
//       phone,
//       dateOfBirth,
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: "User registered successfully",
//       user: newUser,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ---------------------- LOGIN USER ----------------------
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

//     res.status(200).json({
//       message: "Login successful",
//       user,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { registerUser, loginUser };


const User = require("../models/User");

// REGISTER USER — debug version
const registerUser = async (req, res) => {
  try {
    console.log("📝 Signup request body:", req.body);

    const { name, email, password, phone, dateOfBirth } = req.body;

    if (!name || !email || !password || !phone || !dateOfBirth) {
      return res.status(400).json({
        message: "All fields are required",
        received: { name, email, password, phone, dateOfBirth }
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
    console.log("✅ New user saved:", saved);

    res.status(201).json({
      message: "User registered successfully",
      user: saved,
    });
  } catch (error) {
    console.error("❗ Register Error — full:", error, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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

module.exports = { registerUser, loginUser };
