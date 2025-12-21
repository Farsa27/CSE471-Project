
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    trainName: { type: String, required: true },
    from: { type: String, required: true },        // e.g. "Delhi"
    to: { type: String, required: true },          // e.g. "Mumbai"
    departureTime: { type: String, required: true }, // e.g. "14:30"
    arrivalTime: { type: String, required: true },   // e.g. "06:15"
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
