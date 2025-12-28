const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getAllAds,
  getActiveAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  toggleAdStatus,
} = require("../controllers/adController");

// Get all ads (admin)
router.get("/", getAllAds);

// Get active ads only (public)
router.get("/active", getActiveAds);

// Get ad by ID
router.get("/:id", getAdById);

// Create new ad
router.post("/", upload.single("image"), createAd);

// Update ad
router.put("/:id", upload.single("image"), updateAd);

// Delete ad
router.delete("/:id", deleteAd);

// Toggle ad status
router.patch("/:id/toggle", toggleAdStatus);

module.exports = router;
