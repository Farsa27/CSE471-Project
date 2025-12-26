
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  favoriteStations: {
    type: [String],
    default: [],
  },
  isStudent: {
    type: Boolean,
    default: false,
  },
  studentIdCard: {
    type: String,
    default: "",
  },
  studentSecondDocument: {
    type: String,
    default: "",
  },
  studentVerificationStatus: {
    type: String,
    enum: ["none", "pending", "verified", "rejected"],
    default: "none",
  },
  studentVerificationExpiry: {
    type: Date,
    default: null,
  },
  wifiSubscriptionActive: {
    type: Boolean,
    default: false,
  },
  wifiSubscriptionExpiry: {
    type: Date,
    default: null,
  },
  wifiId: {
    type: String,
    default: "",
  },
  wifiPassword: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
