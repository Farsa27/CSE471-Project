const Report = require("../models/Report");
const User = require("../models/User");

// Helper to map uploaded files to public paths
const mapFiles = (files) => {
  if (!files) return [];
  return files.map((f) => "/uploads/" + f.filename);
};

const submitAppBug = async (req, res) => {
  try {
    const { userId, subject, description, rating } = req.body;

    if (!userId) return res.status(401).json({ message: "User required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!description) return res.status(400).json({ message: "Description required" });

    const media = mapFiles(req.files);

    const report = new Report({
      reporter: user._id,
      type: "app",
      subject,
      description,
      rating: rating ? Number(rating) : undefined,
      media,
    });

    const saved = await report.save();
    res.status(201).json({ message: "App bug reported", report: saved });
  } catch (error) {
    console.error("submitAppBug error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const submitStationHazard = async (req, res) => {
  try {
    const { userId, stationLocation, description } = req.body;

    if (!userId) return res.status(401).json({ message: "User required" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!stationLocation || !description)
      return res.status(400).json({ message: "All fields required" });

    const media = mapFiles(req.files);

    const report = new Report({
      reporter: user._id,
      type: "station",
      stationLocation,
      description,
      media,
    });

    const saved = await report.save();
    res.status(201).json({ message: "Station hazard reported", report: saved });
  } catch (error) {
    console.error("submitStationHazard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyAppBugReports = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(401).json({ message: "User required" });

    const reports = await Report.find({ reporter: userId, type: "app" })
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ reports });
  } catch (error) {
    console.error("getMyAppBugReports error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyStationHazardReports = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(401).json({ message: "User required" });

    const reports = await Report.find({ reporter: userId, type: "station" })
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ reports });
  } catch (error) {
    console.error("getMyStationHazardReports error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all reports for admin
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ reports });
  } catch (error) {
    console.error("getAllReports error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete/resolve a report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndDelete(id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report resolved and deleted", report });
  } catch (error) {
    console.error("deleteReport error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  submitAppBug, 
  submitStationHazard, 
  getMyAppBugReports, 
  getMyStationHazardReports,
  getAllReports,
  deleteReport
};
