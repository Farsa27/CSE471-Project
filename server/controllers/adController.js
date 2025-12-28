const Ad = require("../models/Ad");
const fs = require("fs");
const path = require("path");

// Get all ads
const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ads", error: error.message });
  }
};

// Get active ads only
const getActiveAds = async (req, res) => {
  try {
    const ads = await Ad.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ads", error: error.message });
  }
};

// Get ad by ID
const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ad", error: error.message });
  }
};

// Create new ad
const createAd = async (req, res) => {
  try {
    const { title, description, link, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newAd = new Ad({
      title,
      description,
      imageUrl,
      link,
      order: order || 0,
    });

    await newAd.save();
    res.status(201).json({ message: "Ad created successfully", ad: newAd });
  } catch (error) {
    res.status(500).json({ message: "Failed to create ad", error: error.message });
  }
};

// Update ad
const updateAd = async (req, res) => {
  try {
    const { title, description, link, order, isActive } = req.body;
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // Update fields
    if (title !== undefined) ad.title = title;
    if (description !== undefined) ad.description = description;
    if (link !== undefined) ad.link = link;
    if (order !== undefined) ad.order = order;
    if (isActive !== undefined) ad.isActive = isActive;

    // Update image if new file uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, "..", ad.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      ad.imageUrl = `/uploads/${req.file.filename}`;
    }

    await ad.save();
    res.status(200).json({ message: "Ad updated successfully", ad });
  } catch (error) {
    res.status(500).json({ message: "Failed to update ad", error: error.message });
  }
};

// Delete ad
const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // Delete image file
    const imagePath = path.join(__dirname, "..", ad.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Ad.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ad", error: error.message });
  }
};

// Toggle ad active status
const toggleAdStatus = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    ad.isActive = !ad.isActive;
    await ad.save();

    res.status(200).json({ message: "Ad status updated", ad });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle ad status", error: error.message });
  }
};

module.exports = {
  getAllAds,
  getActiveAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  toggleAdStatus,
};
