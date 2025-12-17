// backend/src/controllers/adminController.js

// Simple hardcoded admin login (no database yet)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", { email });

    if (email === "admin@mrt.com" && password === "admin123") {
      return res.json({
        success: true,
        message: "Login successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
