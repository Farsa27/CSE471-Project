// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: String, // You can change to Date if needed
    required: true,
  },

  // Favorite Stations & Routes
  favoriteStations: {
    type: [String],
    default: [],
  },
  favoriteRoutes: {
    type: [
      {
        scheduleId: { type: String },
        trainName: { type: String },
        from: { type: String },
        to: { type: String },
        departureTime: { type: String },
        arrivalTime: { type: String },
        price: { type: Number },
      },
    ],
    default: [],
  },

  // Student Verification
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

  // WiFi Subscription
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

  notifications: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        alternative: {
          type: String,
          default: "",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default: [],
  },
});


module.exports = mongoose.model("User", userSchema);