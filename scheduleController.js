import Schedule from "../models/Schedule.js";

// GET all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ createdAt: -1 });
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Server error. Unable to fetch schedules." });
  }
};

// CREATE a new schedule
export const createSchedule = async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    const savedSchedule = await schedule.save();
    res.status(201).json({
      message: "Schedule created successfully!",
      schedule: savedSchedule,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(400).json({ message: "Failed to create schedule", error: error.message });
  }
};

// UPDATE a schedule
export const updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({
      message: "Schedule updated successfully!",
      schedule: updatedSchedule,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: "Failed to update schedule", error: error.message });
  }
};

// DELETE a schedule
export const deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({ message: "Schedule deleted successfully!" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete schedule" });
  }
};