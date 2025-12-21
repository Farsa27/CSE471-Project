
const express = require("express");
const {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const Schedule = require("../models/Schedule");

const router = express.Router();

router.get("/", getAllSchedules);
router.post("/", createSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

module.exports = router;
