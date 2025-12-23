const User = require("../models/User");

// Submit student verification
exports.submitStudentVerification = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: "Both student ID card and NID/Birth certificate are required" });
    }

    const studentIdCard = `/uploads/${req.files[0].filename}`;
    const studentSecondDocument = `/uploads/${req.files[1].filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        studentIdCard,
        studentSecondDocument,
        studentVerificationStatus: "pending",
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Student verification submitted successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending student verifications (Admin)
exports.getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      studentVerificationStatus: "pending",
    }).select("-password");

    res.status(200).json({ users: pendingUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify student (Admin)
exports.verifyStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // "verify" or "reject"

    let updateData;
    
    if (action === "verify") {
      // Set 6-month expiry
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 6);
      
      updateData = {
        studentVerificationStatus: "verified",
        isStudent: true,
        studentVerificationExpiry: expiryDate,
      };
    } else {
      updateData = {
        studentVerificationStatus: "rejected",
        isStudent: false,
        studentVerificationExpiry: null,
      };
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Student ${action === "verify" ? "verified" : "rejected"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unverify student (Admin)
exports.unverifyStudent = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        studentVerificationStatus: "none",
        isStudent: false,
        studentVerificationExpiry: null,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Student unverified successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check user verification status
exports.getVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("isStudent studentVerificationStatus studentVerificationExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if verification has expired
    if (user.isStudent && user.studentVerificationExpiry) {
      if (new Date() > new Date(user.studentVerificationExpiry)) {
        // Verification expired, update status
        user.isStudent = false;
        user.studentVerificationStatus = "none";
        user.studentVerificationExpiry = null;
        await user.save();
        
        return res.json({
          isStudent: false,
          studentVerificationStatus: "none",
          expiryDate: null,
        });
      }
    }

    res.status(200).json({
      isStudent: user.isStudent,
      studentVerificationStatus: user.studentVerificationStatus,
      expiryDate: user.studentVerificationExpiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
