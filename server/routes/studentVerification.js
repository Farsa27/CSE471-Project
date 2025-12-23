const express = require("express");
const router = express.Router();
const studentVerificationController = require("../controllers/studentVerificationController");
const upload = require("../middleware/upload");

// Submit student verification
router.post(
  "/submit",
  upload.array("documents", 2),
  studentVerificationController.submitStudentVerification
);

// Get all pending verifications (Admin)
router.get("/pending", studentVerificationController.getPendingVerifications);

// Verify or reject student (Admin)
router.put("/verify/:userId", studentVerificationController.verifyStudent);

// Unverify student (Admin)
router.put("/unverify/:userId", studentVerificationController.unverifyStudent);

// Get verification status
router.get("/status/:userId", studentVerificationController.getVerificationStatus);

module.exports = router;
