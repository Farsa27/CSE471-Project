const Staff = require("../models/Staff");

exports.createStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    console.error("Create staff error:", err.message);
    res.status(400).json({ error: "Failed to create staff" });
  }
};


exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (err) {
    console.error("Get all staff error:", err.message);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};



exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ error: "Staff not found" });
    res.json(staff);
  } catch (err) {
    console.error("Update staff error:", err.message);
    res.status(400).json({ error: "Failed to update staff" });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ error: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error("Delete staff error:", err.message);
    res.status(400).json({ error: "Failed to delete staff" });
  }
};
