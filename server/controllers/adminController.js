
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Admin login attempt:", { email });

    if (email === "admin@mrt.com" && password === "admin123") {
      return res.json({
        success: true,
        message: "Login successful",
        admin: {
          email: "admin@mrt.com",
          name: "Admin"
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = { adminLogin };
