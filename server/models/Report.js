const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["app", "station"], required: true },
  subject: { type: String },
  description: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  stationLocation: { type: String },
  media: [{ type: String }], // file paths
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
